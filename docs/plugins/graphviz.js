let pluginGraphviz = (hook, vm) => {

    hook.init(function() {
        window.$docsify['viz'] = {num: 0, txt: []};
    });

    hook.afterEach(function (html, next) {
        viz = window.$docsify['viz'];

        // We load the HTML inside a DOM node to allow for manipulation
        var htmlElement = document.createElement('div');
        htmlElement.innerHTML = html;

        htmlElement.querySelectorAll('pre[data-lang=graphviz]').forEach((element) => {
            viz.txt = [].concat(viz.txt, element.textContent);
            var replacement = document.createElement('div');
            replacement.id = `viz-svg-${viz.num}`;
            replacement.style['text-align'] = 'center';

            // Replace
            element.parentNode.replaceChild(replacement, element);

	    viz.num++;
        });

        next(htmlElement.innerHTML);
    });

    hook.doneEach(function () {
        viz = window.$docsify['viz'];
        for (i = 0; i < viz.num; i++) {
            d3.select(`#viz-svg-${i}`).graphviz().renderDot(`${viz.txt[i]}`);
            d3.select(`#viz-svg-${i}`).graphviz().options({zoom:false});
        }
        window.$docsify['viz'] = {num: 0, txt: []};
    });

};

window.$docsify.plugins = [].concat(pluginGraphviz, window.$docsify.plugins);
