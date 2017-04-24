import Job from './Job';
import ProcessManage from './ProcessManage';
import store from '../models/store';

const run = async () => {
  await store.isReady();
  const pm = new ProcessManage({ maxProcess: 2 });

  const jobInfo = {
    dantri: [
      { path: 'nhip-song-tre.htm', name: 'Nhịp sống trẻ' },
      { path: 'giai-tri.htm', name: 'Giải trí' },
      { path: 'http://dulich.dantri.com.vn/du-lich/kham-pha.htm', name: 'Du lịch', selector: 'dulich' },
      { path: 'http://dulich.dantri.com.vn/du-lich/tours-ua-thich.htm', name: 'Du lịch', selector: 'dulich' },
    ],
    vietbao: [
      { path: '/The-gioi-tre/', name: 'Nhịp sống trẻ' },
      { path: '/Bong-da/', name: 'Bóng đá' }
    ],
    phununews: [
      { path: '/giai-tri/', name: 'Giải trí' },
      { path: '/nha-dep/', name: 'Nhà đẹp' },
    ],
    vietnamnet: [
      { path: '/vn/giai-tri/', name: 'Giải trí' },
      { path: '/vn/cong-nghe/', name: 'Công nghệ' },
      { path: '/vn/doi-song/du-lich/', name: 'Du lịch' },
    ],
    zingnews: [
      { path: '/giai-tri.html', name: 'Giải trí' },
      { path: '/du-lich.html', name: 'Du lịch' },
    ]
  };

  Object.keys(jobInfo).forEach(key => {
    jobInfo[key].forEach(item => {
      const job1 = new Job({
        ...item,
        agent: key
      });
      pm.pushJob(job1);
    });
  });
};
run().catch(e => {
  console.error(e);
  process.exit(1);
});
