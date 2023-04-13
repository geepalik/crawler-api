/* eslint-disable prettier/prettier */
export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  host: process.env.HOST,
  databaseURL: process.env.DATABASE_URL,
  databaseContainerURL: process.env.DATABASE_CONTAINER_URL,
  localFilesPath: process.env.LOCAL_FILES_PATH,
});
