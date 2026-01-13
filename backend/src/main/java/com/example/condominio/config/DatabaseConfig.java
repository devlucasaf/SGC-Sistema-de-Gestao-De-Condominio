package com.condominio.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.condominio.repository",
        entityManagerFactoryRef = "entityManagerFactory",
        transactionManagerRef = "transactionManager"
)
@EnableJpaAuditing
public class DatabaseConfig {

    @Autowired
    private Environment env;

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();

        // Configurações do banco de dados
        dataSource.setDriverClassName(env.getProperty("spring.datasource.driver-class-name", "org.postgresql.Driver"));
        dataSource.setUrl(env.getProperty("spring.datasource.url", "jdbc:postgresql://localhost:5432/condominio_db"));
        dataSource.setUsername(env.getProperty("spring.datasource.username", "postgres"));
        dataSource.setPassword(env.getProperty("spring.datasource.password", "postgres"));

        // Configurações de pool de conexões
        dataSource.setConnectionProperties(getConnectionProperties());

        return dataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource());
        em.setPackagesToScan("com.condominio.model");
        em.setPersistenceUnitName("condominioPU");

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);

        Map<String, Object> properties = new HashMap<>();

        // Propriedades do Hibernate
        properties.put("hibernate.hbm2ddl.auto",
                env.getProperty("spring.jpa.hibernate.ddl-auto", "update"));
        properties.put("hibernate.dialect",
                env.getProperty("spring.jpa.properties.hibernate.dialect",
                        "org.hibernate.dialect.PostgreSQLDialect"));
        properties.put("hibernate.show_sql",
                env.getProperty("spring.jpa.show-sql", "false"));
        properties.put("hibernate.format_sql",
                env.getProperty("spring.jpa.properties.hibernate.format_sql", "true"));
        properties.put("hibernate.use_sql_comments",
                env.getProperty("spring.jpa.properties.hibernate.use_sql_comments", "true"));

        // Performance
        properties.put("hibernate.jdbc.batch_size",
                env.getProperty("spring.jpa.properties.hibernate.jdbc.batch_size", "20"));
        properties.put("hibernate.order_inserts", "true");
        properties.put("hibernate.order_updates", "true");
        properties.put("hibernate.jdbc.fetch_size", "50");

        // Cache de segundo nível (se habilitado)
        properties.put("hibernate.cache.use_second_level_cache", "false");
        properties.put("hibernate.cache.use_query_cache", "false");
        properties.put("hibernate.generate_statistics", "false");

        // Timezone
        properties.put("hibernate.jdbc.time_zone",
                env.getProperty("spring.jpa.properties.hibernate.jdbc.time_zone", "America/Sao_Paulo"));

        em.setJpaPropertyMap(properties);

        return em;
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory().getObject());
        return transactionManager;
    }

    private Properties getConnectionProperties() {
        Properties properties = new Properties();

        // Configurações do pool de conexões HikariCP
        properties.put("hibernate.hikari.connectionTimeout",
                env.getProperty("spring.datasource.hikari.connection-timeout", "30000"));
        properties.put("hibernate.hikari.minimumIdle",
                env.getProperty("spring.datasource.hikari.minimum-idle", "5"));
        properties.put("hibernate.hikari.maximumPoolSize",
                env.getProperty("spring.datasource.hikari.maximum-pool-size", "20"));
        properties.put("hibernate.hikari.idleTimeout",
                env.getProperty("spring.datasource.hikari.idle-timeout", "600000"));
        properties.put("hibernate.hikari.maxLifetime",
                env.getProperty("spring.datasource.hikari.max-lifetime", "1800000"));
        properties.put("hibernate.hikari.autoCommit",
                env.getProperty("spring.datasource.hikari.auto-commit", "true"));

        // Configurações específicas do PostgreSQL
        properties.put("hibernate.hikari.dataSource.cachePrepStmts", "true");
        properties.put("hibernate.hikari.dataSource.prepStmtCacheSize", "250");
        properties.put("hibernate.hikari.dataSource.prepStmtCacheSqlLimit", "2048");
        properties.put("hibernate.hikari.dataSource.useServerPrepStmts", "true");
        properties.put("hibernate.hikari.dataSource.useLocalSessionState", "true");
        properties.put("hibernate.hikari.dataSource.rewriteBatchedStatements", "true");
        properties.put("hibernate.hikari.dataSource.cacheResultSetMetadata", "true");
        properties.put("hibernate.hikari.dataSource.cacheServerConfiguration", "true");
        properties.put("hibernate.hikari.dataSource.elideSetAutoCommits", "true");
        properties.put("hibernate.hikari.dataSource.maintainTimeStats", "false");

        return properties;
    }

    @Bean
    public javax.validation.Validator validator() {
        return new org.springframework.validation.beanvalidation.LocalValidatorFactoryBean();
    }
}
