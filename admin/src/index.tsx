import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.customFields.register({
      name: "map",
      pluginId: pluginId, // the custom field is created by a color-picker plugin
      type: "string", // the color will be stored as a string
      intlLabel: {
        id: `${pluginId}.color.label`,
        defaultMessage: "Map",
      },
      intlDescription: {
        id: `${pluginId}..color.description`,
        defaultMessage: "Select any point",
      },
      icon: PluginIcon, // don't forget to create/import your icon component
      components: {
        Input: async () => import(/* webpackChunkName: "input-component" */ "./components/MapPicker"),
      },
      options: {
        // declare options here
      },
    });
  },

  bootstrap(app: any) { },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
