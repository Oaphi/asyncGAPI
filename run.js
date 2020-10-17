const asyncGAPIv2 = ({
      funcName,
      onFailure = console.error,
      onSuccess,
      params = []
    }) => {
      return new Promise((res, rej) => {
        google.script.run
          .withSuccessHandler(data => {
            typeof onSuccess === "function" && onSuccess(data);
            res(data);
          })
          .withFailureHandler(error => {
            typeof onFailure === "function" && onFailure(error);
            rej(error);
          })
        [funcName].apply(null, params);
      });
    };

    const runAll = async ({
      onFailure = console.error,
      onSuccess,
      taskMaker = asyncGAPIv2,
      tasks = {}
    }) => {

      const common = { onFailure, onSuccess };

      const entries = Object.entries(tasks);

      const promises = entries.map(
        ([funcName, params = []]) => taskMaker({ ...common, funcName, params })
      );

      const results = await Promise.all(promises);

      return results;
    };
