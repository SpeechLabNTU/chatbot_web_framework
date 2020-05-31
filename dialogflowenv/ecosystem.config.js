module.exports = {
    apps: [{
        name: 'backend',
        script: 'npm',
        args: 'start',
        exec_mode: 'fork',
        instaces: 1,
        autorestart: true,
        watch:false,
        max_memory_start: '1G',
    }]
}
