let pluginHighlightjs = (hook, vm) => {
    hook.afterEach(function(html, next) {
        let h = document.createElement('div');
        h.innerHTML=html;
        h.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
          });
        next(h.outerHTML);
    });
};

window.$docsify.plugins = [].concat(pluginHighlightjs, window.$docsify.plugins);
