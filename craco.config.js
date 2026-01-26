//craco.confic.js 
module.exports = {
    style: { 
        postcss: { 
            plugins: [require("tailwindcss"), require ("autoprefixer")], 
        },
    },
};