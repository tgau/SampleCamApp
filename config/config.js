var config = {}

config.cloudant = {};
config.cloudant.dbname = 'cane_passport';
config.cloudant.account = '2155da12-b2d3-43ca-804e-1c71af5dfd33-bluemix';
config.cloudant.password = '102a61af2895a2638f3b8490e3d8bc4655894916e7459d388a7cacb9bc9fb77a';

config.admin_user = 'admin';
config.admin_pass = 'welcome';
config.index_field = 'username';
config.port = process.env.PORT || 3000;

module.exports = config;