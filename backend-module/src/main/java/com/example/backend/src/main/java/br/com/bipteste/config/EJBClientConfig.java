package br.com.bipteste.config;

import com.example.ejb.ejbmodule.Transferencia;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jndi.JndiObjectFactoryBean;
import org.springframework.jndi.JndiTemplate;

import javax.naming.NamingException;
import java.util.Hashtable;

@Configuration
public class EJBClientConfig {

    @Value("${ejb.jndi.name:ejbmodule-1.0/BeneficioEjbService!com.example.ejb.ejbmodule.Transferencia}")
    private String ejbJndiName;

    @Value("${ejb.initial.context.factory:org.wildfly.naming.client.WildFlyInitialContextFactory}")
    private String initialContextFactory;

    @Value("${ejb.provider.url:http-remoting://localhost:8081}")
    private String providerUrl;

    @Value("${ejb.resource.ref:true}")
    private boolean resourceRef;

    @Bean
    public JndiObjectFactoryBean meuEJB() throws NamingException {
        JndiObjectFactoryBean factoryBean = new JndiObjectFactoryBean();
        factoryBean.setJndiName(ejbJndiName);
        factoryBean.setResourceRef(resourceRef);

        // configurar o ambiente JNDI via JndiTemplate — permite parametrizar provider URL e factory
        Hashtable<String, Object> env = new Hashtable<>();
        env.put(javax.naming.Context.INITIAL_CONTEXT_FACTORY, initialContextFactory);
        env.put(javax.naming.Context.PROVIDER_URL, providerUrl);

        JndiTemplate jndiTemplate = new JndiTemplate();
        java.util.Properties props = new java.util.Properties();
        props.putAll(env);
        jndiTemplate.setEnvironment(props);

        factoryBean.setJndiTemplate(jndiTemplate);

        return factoryBean;
    }
}