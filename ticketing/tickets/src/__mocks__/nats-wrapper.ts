export const natsWrapper = {
  client: {
    publish: (_subject: any, _data: any, callback: Function) => {
      callback();
    },
  },
};
