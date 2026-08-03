export default ({markup, css}) => {
    return `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>MERN Marketplace</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400">
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
          <style>
              a{
                text-decoration: none
              }
              body{
                background:#f6f7fb;
              }
              input, button{
                font: inherit;
              }
              @media (max-width: 900px){
                .top-nav{
                  grid-template-columns: 1fr !important;
                  padding-bottom: 18px;
                  padding-top: 18px;
                }
                .nav-actions{
                  justify-content: flex-start !important;
                }
                .hero-row{
                  grid-template-columns: 1fr !important;
                }
                .content-layout{
                  grid-template-columns: 1fr !important;
                }
                .feature-grid{
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
              }
              @media (max-width: 640px){
                .feature-grid{
                  grid-template-columns: 1fr !important;
                }
                .listing-grid{
                  grid-template-columns: 1fr !important;
                }
              }
          </style>
        </head>
        <body style="margin:0">
          <div id="root">${markup}</div>
          <style id="jss-server-side">${css}</style>
          <script id="stripe-js" src="https://js.stripe.com/v3/" async></script>
          <script type="text/javascript" src="/dist/bundle.js"></script>
        </body>
      </html>`
}
