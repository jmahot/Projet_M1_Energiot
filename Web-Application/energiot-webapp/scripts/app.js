const embedContainer = document.getElementById("dashboard-container");

const reportEmbedConfig = {
  type: 'report',
  embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=0ec565bb-ff2c-40b8-b323-04871313555e&autoAuth=true&ctid=413600cf-bd4e-4c7c-8a61-69e73cddf731',
  accessToken: 'YOUR_EMBED_TOKEN',
  tokenType: models.TokenType.Embed,
  settings: {
    panes: {
      filters: {
        visible: false
      },
      pageNavigation: {
        visible: false
      }
    }
  }
};

// Embed the report when ready
// var report = powerbi.embed(embedContainer, reportEmbedConfig);
