package sgc.condominio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SgcApplication {

	public static void main(String[] args) {
		SpringApplication.run(SgcApplication.class, args);
	}

}
