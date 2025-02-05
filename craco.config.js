module.exports = {
    webpack: {
        configure: {
            module: {
                rules: [
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/i,
                        type: 'asset/resource',
                        dependency: { not: ['url'] },
                        generator: {
                            filename: 'static/fonts/[name][ext]'
                        }
                    }
                ]
            }
        }
    }
}; 