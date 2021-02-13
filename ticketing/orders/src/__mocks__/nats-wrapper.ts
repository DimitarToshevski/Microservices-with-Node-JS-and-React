export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((_subject: any, _data: any, callback: Function) => {
        callback();
      }),
  },
};
