package controllers.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.inject.Inject;
import play.mvc.*;
import services.pub.ISocketsManager;

/**
 * Created by tzachit on 17/11/14.
 */
public class SocketsController extends Controller {

    private final ISocketsManager _socketsManager;

    @Inject
    public SocketsController(ISocketsManager socketsManager){
        this._socketsManager = socketsManager;
    }

    public WebSocket<JsonNode> add() {
        return WebSocket.whenReady((in, out) -> {

            this._socketsManager.add(out);

            // When the socket is closed.
            in.onClose(() -> this._socketsManager.remove(out));
        });
    }
}
