import Job from './Job';
import ProcessManage from './ProcessManage';
import store from '../models/store';

const run = async () => {
  await store.isReady();
  const pm = new ProcessManage({ maxProcess: 2 });

  // create jobs
  const job1 = new Job({ agent: 'dantri', path: 'nhip-song-tre.htm', name: 'Nhịp sống trẻ' });
  pm.pushJob(job1);

  const job2 = new Job({ agent: 'dantri', path: 'giai-tri.htm', name: 'Giải trí' });
  pm.pushJob(job2);

  const job3 = new Job({ agent: 'vietbao', path: '/The-gioi-tre/', name: 'Nhịp sống trẻ' });
  pm.pushJob(job3);

  const job4 = new Job({ agent: 'vietbao', path: '/Bong-da/', name: 'Bóng đá' });
  pm.pushJob(job4);
};
run().catch(e => {
  console.error(e);
  process.exit(1);
});
