import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('report-queue') // Mendengarkan pekerjaan dari 'report-queue'
export class ReportProcessor extends WorkerHost{
    async process(job: Job, token?: string): Promise<any> {
        if (job.name === 'generate-report') {
            console.log('--- MEMULAI PROSES GENERATE LAPORAN UNTUK JOB:', job.id, '---');
            console.log('Data pekerjaan:', job.data);

            // Simulasi proses yang berjalan lama (5 detik)
            await new Promise<void>((resolve) => setTimeout(resolve, 5000));

            console.log(`✅ Laporan untuk produk #${job.data.productId} SELESAI.`);
            // Di sini Anda bisa menaruh logika untuk menyimpan PDF, mengirim email, dll.
            return {};
        } else {
            throw new Error("Method not implemented.");
        }

    }

}