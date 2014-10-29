(doc, req) ->
  {getQuickBasePath} = require 'lib/path-utils'

  provides 'html', ->
    domain = req.headers['Host']
    path = req.requested_path or req.path

    baseURL = getQuickBasePath domain + '/' + path.join('/')

    return """
    <textarea style="margin: 2px; width: 701px; height: 318px;position: absolute;position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: auto;">
      <script>
      (function(t,r,a,c,k){k=r.createElement('script');k.type='text/javascript';
      k.async=true;k.src=a;k.id='ma';r.getElementsByTagName('head')[0].appendChild(k);
      t.maq=[];t.mai=c;t.ma=function(){t.maq.push(arguments)};
      })(window,document,'http://#{baseURL}/tracker.js','#{req.uuid.split('').reverse().slice(0, 8).join('')}');

      ma('pageView');
      </script>
    </textarea>
    """
