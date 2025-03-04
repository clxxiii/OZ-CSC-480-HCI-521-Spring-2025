package quotes;

import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.images.builder.ImageFromDockerfile;

public class LibertyContainer extends GenericContainer<LibertyContainer> {
    public LibertyContainer(ImageFromDockerfile image, int httpPort, int httpsPort) {
        super(image);
        withExposedPorts(httpPort, httpsPort);

        // wait for smarter planet message by default
        waitingFor(Wait.forLogMessage("^.*CWWKF0011I.*$", 1));
    }

    public String getBaseUrl() {
        return "http://" + getHost() + ":" + getFirstMappedPort();
    }
}
