module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'root',
      host : '115.159.115.210',
      ref  : 'origin/main',
      repo : 'https://github.com/chenmiaochao/chenmiaochao-fabulousGarden-backend-koa2-mongodb',
      path : '/var/www/fb-backend',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
