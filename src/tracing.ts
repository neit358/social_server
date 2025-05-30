// import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
// import { Resource } from '@opentelemetry/resources';
// import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
// import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
// import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
// import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

// const jaegerExporter = new JaegerExporter({
//   endpoint: 'http://localhost:14268/api/traces',
// });

// const traceExporter = jaegerExporter;

// const spanProcessor: SimpleSpanProcessor = new SimpleSpanProcessor(traceExporter);

// export const otelSDK = new NodeSDK({
//   resource: new Resource({
//     [SemanticResourceAttributes.SERVICE_NAME]: `nestjs-otel`,
//   }),
//   spanProcessor,
//   instrumentations: [
//     new HttpInstrumentation(),
//     new ExpressInstrumentation(),
//     new NestInstrumentation(),
//   ],
// });

// process.on('SIGTERM', () => {
//   otelSDK
//     .shutdown()
//     .then(
//       () => console.log('SDK shut down successfully'),
//       (err) => console.log('Error shutting down SDK', err),
//     )
//     .finally(() => process.exit(0));
// });
