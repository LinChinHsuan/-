const app = {
    data() {
      return {
        list:[],
        newTask:'',
        nowDoingTask:'',
        showList: false,
        timer:null,
        count:'',
        tmpCount:0,
        clockWorking:false,
        timeStop:false,
        Nowreset:false,
        TomatoNum:0,
      }
    },
    methods: {
      addTask(){
        if(!this.newTask){
          return
        }
        this.list.push({
          content:this.newTask,
          nowDoing:false
        });
        this.newTask = '';
        this.addlocalStorage();
      },
      delTask(i){
        if(this.list[i].nowDoing){
          this.nowDoingTask = { content: '尚未有任務'};
        }
        this.list.splice(i,1);
        this.addlocalStorage();
      },
      doThisTask(i){
        const vm = this;
        this.list.forEach((item,index) => {
          if( i === index ) {
            item.nowDoing = true;
            vm.nowDoingTask = item;
          }else{
            item.nowDoing = false;
          }
        });
        this.addlocalStorage();
      },
      doItNow(i){
        this.doThisTask(i);
        this.showList = false;
        this.timeStop = false;
        this.clockStart();
      },
      addlocalStorage(){
        const Tasks = JSON.stringify(this.list);
        const TomatoNum = JSON.stringify(this.TomatoNum);
        localStorage.setItem('Tasks',Tasks);
        localStorage.setItem('TomatoNum',TomatoNum);
      },
      clockStart(){
        this.clockWorking = true;
        if(this.tmpCount){
          this.count = this.tmpCount;
        }else{
          this.count = 1500;
        }
        this.timeInterval = setInterval(this.countDown, 1000)
      },
      countDown(){
        this.count = this.count - 1;
        if (this.count === 0) {
          this.Nowreset = !this.Nowreset;
          this.clockEnd();
        }
      },
      clockStop(){
        clearInterval(this.timeInterval);
        this.tmpCount = this.count;
        this.timeStop = !this.timeStop;
        if(!this.timeStop){
          this.clockStart();
        }
      },
      clockEnd(){
        clearInterval(this.timeInterval);
        this.clockWorking = false;
        if(this.Nowreset){
          this.TomatoNum = this.TomatoNum + 1;
          this.addlocalStorage();
          this.timeStop = true;
          this.count = 300;
          this.timeInterval = setInterval(this.countDown, 1000);
        }else {
          this.timeStop = false;
        }
      },
      resetEnd(){
        this.Nowreset = false;
        this.timeStop = false;
        clearInterval(this.timeInterval);
        this.count = 0;
        this.clockWorking = false;
      }
    },
    computed:{
      NowTime(){
        let minutes = parseInt(this.count/60);
        let seconds = this.count%60;
        if(seconds <10){
          seconds = '0' + seconds;
        }
        return `${minutes}:${seconds}`;
      },
      percentage(){
        return 100 - parseInt(this.count / 1500 *100);
      }
    },
    created() {
      this.list = JSON.parse(localStorage.getItem('Tasks')) || [];
      let len = this.list.length;
      if(len === 0){
        this.nowDoingTask = { content: '尚未有任務'};
      }else if(len === 1){
        this.doThisTask(0);
        this.nowDoingTask = this.list[0];
      }else {
        this.nowDoingTask = this.list.find(item=>{
            return item.nowDoing === true
          });
      }
      this.TomatoNum = JSON.parse(localStorage.getItem('TomatoNum'));
    },
  }
  
  Vue.createApp(app).mount('#app')