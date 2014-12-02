package services.pub;

import play.mvc.WebSocket;

/**
 * Created by tzachit on 17/11/14.
 */

public interface ISocketsManager {
    void add(WebSocket.Out out);
    void remove(WebSocket.Out out);
    <T> void notifyAll(T message);
}
