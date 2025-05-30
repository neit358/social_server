// import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
// import { Job } from 'bullmq';

// @Processor('user')
// export class BullMQConsumer extends WorkerHost {
//   async process(job: Job<any, any, string>): Promise<any> {
//     switch (job.name) {
//       case 'example-job':
//         return new Promise(() => {});
//     }
//   }

//   @OnWorkerEvent('active')
//   onActive(job: Job<{ foo: string }>) {
//     console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data.foo}...`);
//   }
// }
