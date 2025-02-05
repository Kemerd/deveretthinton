module.exports = {
    // ... other config options
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                dependency: { not: ['url'] },
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            }
        ]
    }
}; 