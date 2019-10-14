module.exports = {
    'src_folders': ['test'],
    'webdriver': {
        'start_process': true,
        'server_path': require('chromedriver').path,
        'port': 9515
    },
    'test_settings': {
        'default': {
            // 'screenshots': {
            //     'enabled': true,
            //     'on_failure': true,
            //     'on_error': true,
            //     'path': 'tests_output/screenshots'
            // },
            'desiredCapabilities': {
                'browserName': 'chrome',
                'chromeOptions': {
                    'args': ['--headless']
                }
            }
        }
    }
};
