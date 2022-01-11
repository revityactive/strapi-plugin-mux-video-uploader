import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import pluginPermissions from './permissions';
import PluginIcon from './components/icons';
import getTrad from './utils/getTrad';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      permissions: pluginPermissions.main,
      Component: async () => { 
        const component = await import(
          /* webpackChunkName: "mux-video-uploader" */ './containers/HomePage'
        );

        return component;
      },
    });

    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: getTrad('SettingsNav.section-label'),
          defaultMessage: 'Mux Video Uploader plugin',
        },
      },
      [
        {
          intlLabel: {
            id: getTrad('SettingsNav.link.settings'),
            defaultMessage: 'Configuration',
          },
          id: 'mux-video-uploader-settings',
          to: `/settings/${pluginId}`,
          permissions: pluginPermissions.accessRoles,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "mux-video-uploader-settings-page" */ './containers/Settings'
            );

            return component;
          },
        }
      ]
    );

    app.registerPlugin({
      id: pluginId,
      name,
    });
  },
  bootstrap() {},
  async registerTrads({ locales }: { locales:any }) {
    const importedTrads = await Promise.all(
      locales.map((locale:any) => {
        return import(
          /* webpackChunkName: "users-permissions-translation-[request]" */ `./translations/${locale}.json`
        )
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
