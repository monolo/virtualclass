import convict from 'convict';

const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    mongo: {
        url: {
            doc: 'The Mongo connection URL',
            format: String,
            default: 'mongodb://localhost:27017/virtualclass',
            env: 'MONGO_URL'
        }
    },
    jwtSecret: {
        doc: 'Secret key to sign the jwt token',
        format: String,
        default: 'virtualclass default signature',
        env: 'JWT_SECRET'
    },
    rabbitmq: {
        url: {
            doc: 'The RabbitMq connection URL',
            format: String,
            default: 'amqp://localhost',
            env: 'RABBITMQ_URL'
        },
        queue: {
            doc: 'RabbitMq listener',
            format: String,
            default: 'virtualclass-user',
            env: 'RABBITMQ_QUEUE'
        },
        noAck: {
            doc: '',
            default: false,
            format: Boolean,
            env: 'RABBITMQ_NO_ACK'
        }
    }
});

config.loadFile([__dirname + '/default.json', __dirname + '/' + config.get('env') + '.json']);
export default config;
