import LoadableComp from '../../components/code-splitting/LoadableComp';

const AsyncWebsite = LoadableComp({ // n1
  loader: () => import("./Website" /* webpackChunkName: "website-content-lazy" */),
});

export default AsyncWebsite;
/* COMMENTS
n1: magic comments options:
webpackMode
'lazy' (default): Generates a lazy-loadable chunk for each import()ed module.
'lazy-once': Generates a single lazy-loadable chunk that can satisfy all calls to import(). The chunk will be fetched on the first call to import(), and subsequent calls to import() will use the same network response. Note that this only makes sense in the case of a partially dynamic statement, e.g. import(`./locales/${language}.json`), where multiple module paths that can potentially be requested.
'eager': Generates no extra chunk. All modules are included in the current chunk and no additional network requests are made. A Promise is still returned but is already resolved. In contrast to a static import, the module isn't executed until the call to import() is made.
'weak': Tries to load the module if the module function has already been loaded in some other way (e.g. another chunk imported it or a script containing the module was loaded). A Promise is still returned, but only successfully resolves if the chunks are already on the client. If the module is not available, the Promise is rejected. A network request will never be performed. This is useful for universal rendering when required chunks are always manually served in initial requests (embedded within the page), but not in cases where app navigation will trigger an import not initially served.
*/
