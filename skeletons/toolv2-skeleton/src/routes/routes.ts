import web from './rendering-info/web';
import stylesheet from './stylesheet';
import optionAvailability from './option-availability';
import dynamicSchemas from './dynamic-schemas/index';
import health from './health';
import locales from './locales';
import exampleNotification from './notifications/exampleNotification';
import schema from './schema';

const allRoutes = [
  ...dynamicSchemas,
  ...schema,
  exampleNotification,
  health,
  locales,
  optionAvailability,
  stylesheet,
  web,
];

export default allRoutes;
