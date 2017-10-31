module.exports = Socket;

function Socket(io) {

    io.on('connection', function (socket) {
        socket.on('subscribe', function (retroId) {
            socket.join(retroId);
        });

        socket.on('enter', data => {
            io.in(data.retroId).emit('enter_member', data.user);
        });

        socket.on('left', data => {
            io.in(data.retroId).emit('left_member', data.user);
        });

    });

}