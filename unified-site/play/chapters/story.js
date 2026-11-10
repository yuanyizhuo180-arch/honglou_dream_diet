const CHAPTERS = {
  dao: {
    game: '../daoxiang-game.html', title: '稻香村 · 雪日送暖', scenes: {
      A0:{next:'A1'},
      A1:{source:'事实概述 · 第四十九、五十回 · 芦雪庵',speaker:'叙述',line:'雪日里，众人依李纨的提议聚在芦雪庵，围炉联诗。',left:'liwan',right:'baoyu',next:'A2'},
      A2:{source:'游戏改编对白 · 芦雪庵',speaker:'李纨',line:'外头雪紧，快进来坐着暖和。诗社的人齐了，咱们便开始。',leftExpression:'smile',left:'liwan',next:'A3'},
      A3:{source:'原著联句 · 第五十回 · 芦雪庵',speaker:'叙述',line:'王熙凤起句：“一夜北风紧”；李纨续道：“开门雪尚飘。”',left:'liwan',next:'A4'},
      A4:{source:'游戏改编对白 · 芦雪庵',speaker:'李纨',line:'宝玉，你这一回落了后，可得依大家的意思领罚。',leftExpression:'smile',left:'liwan',right:'baoyu',next:'A5'},
      A5:{source:'游戏改编对白 · 芦雪庵',speaker:'贾宝玉',line:'诗虽作得不好，若有旁的事，我情愿替大家去做。',right:'baoyu',next:'A6'},
      A6:{source:'游戏改编对白 · 第五十回情境',speaker:'李纨',line:'那就请你到栊翠庵，替我们折一枝红梅来赏。',left:'liwan',right:'baoyu',next:'A7'},
      A7:{source:'事实概述 · 第五十回 · 芦雪庵',speaker:'叙述',line:'宝玉带梅回来，探春递了暖酒，丫鬟们接下蓑笠掸雪。',right:'baoyu',next:'A8'},
      A8:{source:'游戏改编对白 · 芦雪庵',speaker:'贾宝玉',line:'雪还沾在衣上呢。你们快瞧，这一枝梅花开得可好？',rightExpression:'smile',right:'baoyu',next:'A9'},
      A9:{source:'事实概述 · 第五十回 · 芦雪庵',speaker:'叙述',line:'各房丫鬟添送衣服，袭人也遣人送来一件半旧的狐腋褂。',right:'baoyu',next:'A10'},
      A10:{source:'游戏改编对白 · 送食准备',speaker:'李纨',line:'袭人想着送衣，咱们也送些吃的给她。那蒸芋头还热着，盛一盘去。',left:'liwan',next:'A11'},
      A11:{source:'游戏改编对白 · 送食准备',speaker:'侍女',line:'还有朱橘、黄橙和橄榄，也一并带去么？',right:'maid',next:'A12'},
      A12:{source:'游戏改编对白 · 送食准备',speaker:'李纨',line:'好，再盛两盘果子。芋头和果品分开放，带过去也方便。',left:'liwan',right:'maid',next:'A13'},
      A13:{source:'游戏改编对白 · 柜格整理',speaker:'我（游戏整理者）',line:'柜格里的备食物件还未归齐，我来帮忙整理。',left:'liwan',right:'maid',action:'开始整理'},
      B1:{source:'游戏改编对白 · 送食准备',speaker:'侍女',line:'芋头和果品都在这里，要带去的东西，我这就照看。',right:'maid',next:'B2'},
      B2:{source:'游戏改编对白 · 送食准备',speaker:'李纨',line:'趁芋头还暖，早些送去。果盘也拿稳当些。',left:'liwan',right:'maid',next:'B3'},
      B3:{source:'游戏改编对白 · 送食准备',speaker:'侍女',line:'我记下了，再替奶奶向袭人姑娘问好。',rightExpression:'smile',right:'maid',next:'B4'},
      B4:{source:'事实概述 · 第五十回 · 芦雪庵',speaker:'叙述',line:'李纨命人将一盘蒸芋头和两盘朱橘、黄橙、橄榄等物带给袭人。',left:'liwan',right:'maid',next:'B5'},
      B5:{source:'游戏改编对白 · 怡红院 · 送食后',speaker:'侍女',line:'袭人姑娘，这是李奶奶叫我带来的芋头和果品。',left:'xiren',right:'maid',background:'yihong',next:'B6'},
      B6:{source:'游戏改编对白 · 怡红院 · 送食后',speaker:'袭人',line:'雪天还惦记着我，劳你替我谢过李奶奶。',leftExpression:'smile',left:'xiren',right:'maid',background:'yihong',next:'B7'},
      B7:{source:'游戏改编对白 · 怡红院 · 送食后',speaker:'侍女',line:'芋头还是暖的，姑娘先歇一歇，再慢慢用。',left:'xiren',right:'maid',background:'yihong',next:'B8'},
      B8:{source:'游戏改编对白 · 怡红院 · 送食后',speaker:'袭人',line:'好。她们在雪里赏梅，也请你提醒大家仔细着凉。',left:'xiren',background:'yihong',next:'B9'},
      B9:{source:'事实概述 · 第五十回 · 芦雪庵',speaker:'叙述',line:'芦雪庵里，众人赏着宝玉带回的红梅，又催他作诗。',left:'liwan',right:'baoyu',next:'B10'},
      B10:{source:'游戏改编对白 · 芦雪庵',speaker:'贾宝玉',line:'梅花费了我许多工夫才讨来，如今还得再作一首诗。',right:'baoyu',next:'B11'},
      B11:{source:'游戏改编对白 · 芦雪庵',speaker:'李纨',line:'梅花既得了，诗也不能省，且听你怎么写。',leftExpression:'smile',left:'liwan',right:'baoyu',next:'B12'},
      B12:{source:'原著诗句 · 第五十回 · 贾宝玉《访妙玉乞红梅》',speaker:'贾宝玉',line:'不求大士瓶中露，为乞嫦娥槛外梅。',right:'baoyu',end:true}
    }
  },
  heng: {
    game: '../hengwu-banquet.html', title: '蘅芜苑 · 备赏桂花宴', scenes: {
      A0:{next:'A1'},
      A1:{source:'游戏改编对白 · 第三十七回情境',speaker:'史湘云',line:'明日头一回做东，我是欢喜的。只是请哪些人、摆些什么，还得好好想想。',left:'xiangyun',leftExpression:'thoughtful',next:'A2'},
      A2:{source:'游戏改编对白 · 第三十七回情境',speaker:'薛宝钗',line:'请客不只顾着热闹。你手头的月钱有限，若为一回诗社添了难处，反倒不自在。',left:'xiangyun',leftExpression:'thoughtful',right:'baochai',rightExpression:'thoughtful',next:'A3'},
      A3:{source:'游戏改编对白 · 第三十七回情境',speaker:'史湘云',line:'我正怕这个。请得太简慢了，心里过不去；若样样铺张，我又拿不出许多钱。',left:'xiangyun',leftExpression:'thoughtful',next:'A4'},
      A4:{source:'游戏改编对白 · 第三十七回情境',speaker:'薛宝钗',line:'姨娘原说过要请老太太在园里赏桂、吃蟹。咱们顺着这个意思请大家，倒省去另起一席。',left:'xiangyun',leftExpression:'thoughtful',right:'baochai',next:'A5'},
      A5:{source:'游戏改编对白 · 第三十七回情境',speaker:'史湘云',line:'若老太太和姨娘们都来，咱们诗社的姐妹也能聚齐，倒是两全。',left:'xiangyun',next:'A6'},
      A6:{source:'游戏改编对白 · 第三十七回情境',speaker:'薛宝钗',line:'螃蟹我同哥哥说，要几篓好的来；铺子里再取几坛酒，另备果碟。',left:'xiangyun',right:'baochai',next:'A7'},
      A7:{source:'游戏改编对白 · 备宴整理',speaker:'史湘云',line:'蟹是热着吃好，果碟也该先摆妥，免得到时请了人来，席上还忙乱。',left:'xiangyun',leftExpression:'thoughtful',next:'A8'},
      A8:{source:'游戏改编对白 · 备宴整理',speaker:'薛宝钗',line:'先把杯盏、果盘归齐。等长辈们到了，坐在哪里，再请老太太拿主意。',left:'xiangyun',leftExpression:'thoughtful',right:'baochai',next:'A9'},
      A9:{source:'游戏改编对白 · 第三十七回情境',speaker:'史湘云',line:'好姐姐，你把吃的、用的都替我想到了。我明日只管好好请客。',left:'xiangyun',right:'baochai',next:'A10'},
      A10:{source:'游戏改编对白 · 柜格整理',speaker:'我（游戏整理者）',line:'柜格里的席面物件还未归齐，我来帮着整理。',left:'xiangyun',right:'baochai',action:'开始整理'},
      B1:{source:'游戏改编对白 · 菊花诗题',speaker:'薛宝钗',line:'席面有了安排，明日再请大家入园。如今，咱们也该商量诗题了。',left:'xiangyun',right:'baochai',next:'B2'},
      B2:{source:'游戏改编对白 · 第三十七回情境',speaker:'史湘云',line:'昨日才作了海棠诗，眼下菊花正好，不如这一社就咏菊。',left:'xiangyun',next:'B3'},
      B3:{source:'游戏改编对白 · 菊花诗题',speaker:'薛宝钗',line:'先从《忆菊》起，想着菊花，便去《访菊》；访到了，再接着《种菊》。',left:'xiangyun',leftExpression:'thoughtful',right:'baochai',rightExpression:'thoughtful',next:'B4'},
      B4:{source:'游戏改编对白 · 菊花诗题',speaker:'史湘云',line:'种开了便可相对赏菊，再折几枝供在瓶里。这样题目也有了来由。',left:'xiangyun',right:'baochai',next:'B5'},
      B5:{source:'游戏改编对白 · 菊花诗题',speaker:'薛宝钗',line:'再往下，有咏、有画，也可以问菊。最后用《残菊》收住，一季秋景就连起来了。',right:'baochai',next:'B6'},
      B6:{source:'游戏改编对白 · 第三十七回情境',speaker:'史湘云',line:'题目定得这样多，明日可要限韵？',left:'xiangyun',leftExpression:'thoughtful',right:'baochai',rightExpression:'thoughtful',next:'B7'},
      B7:{source:'原著引文 · 第三十七回',speaker:'薛宝钗',line:'只出题，不拘韵。',right:'baochai',next:'B8'},
      B8:{source:'事实概述 · 第三十八回',speaker:'叙述',line:'次日，湘云请贾母等人赏桂。众人来到临水的藕香榭。',background:'oux',next:'B9'},
      B9:{source:'游戏改编对白 · 藕香榭赏桂',speaker:'史湘云',line:'这里临着水，又望得见桂花；先请老太太坐得舒心，大家也好赏景。',left:'xiangyun',background:'oux',next:'B10'},
      B10:{source:'事实概述 · 第三十八回',speaker:'叙述',line:'榭外竹案上，杯箸酒具与茶具分设。席间热蟹、酒与果品相伴，众人边吃边谈。',background:'oux',next:'B11'},
      B11:{source:'游戏改编对白 · 宴后赋诗',speaker:'薛宝钗',line:'席面上吃喝方便，待众人赏过桂，咱们便把昨夜拟的题拿出来。',left:'xiangyun',right:'baochai',background:'oux',next:'B12'},
      B12:{source:'原著诗句 · 第三十八回 · 薛宝钗《忆菊》',speaker:'薛宝钗（蘅芜君）',line:'空篱旧圃秋无迹，瘦月清霜梦有知。',right:'baochai',rightExpression:'thoughtful',background:'oux',next:'B13'},
      B13:{source:'原著诗句 · 第三十八回 · 史湘云《对菊》',speaker:'史湘云（枕霞旧友）',line:'秋光荏苒休辜负，相对原宜惜寸阴。',left:'xiangyun',leftExpression:'thoughtful',background:'oux',end:true}
    }
  },
  oux: {
  "game": "oux-game.html",
  "title": "藕香榭 · 廊下分蟹",
  "scenes": {
    "A0": {
      "next": "A1"
    },
    "A1": {
      "speaker": "王熙凤",
      "line": "螃蟹先拿十个来，余下的仍放蒸笼里。吃了再添，别一齐摆凉了。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏前 · 1/10",
      "right": "xifeng",
      "rightExpression": "normal",
      "next": "A2"
    },
    "A2": {
      "speaker": "王熙凤",
      "line": "姨妈，这一份肉剔好了，您尝尝。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏前 · 2/10",
      "left": "xifeng",
      "leftExpression": "smile",
      "next": "A3"
    },
    "A3": {
      "speaker": "薛姨妈",
      "line": "我自己掰着吃才香甜，不用让。你奉给老太太罢。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏前 · 3/10",
      "left": "xifeng",
      "leftExpression": "normal",
      "next": "A4"
    },
    "A4": {
      "speaker": "旁白",
      "line": "凤姐将蟹肉奉给贾母。湘云陪着吃了一个蟹，便离座让客，又叫人盛两盘，送给赵姨娘、周姨娘。",
      "source": "原著情节转述 · 第三十八回",
      "pageLabel": "游戏前 · 4/10",
      "left": "xiangyun",
      "leftExpression": "thoughtful",
      "next": "A5"
    },
    "A5": {
      "speaker": "王熙凤",
      "line": "你不惯张罗，回去吃你的。这边我替你照看，等散了再吃。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏前 · 5/10",
      "left": "xiangyun",
      "leftExpression": "normal",
      "right": "xifeng",
      "rightExpression": "normal",
      "next": "A6"
    },
    "A6": {
      "speaker": "史湘云",
      "line": "席上有你，我自然放心。只是鸳鸯姐姐她们也忙了半日。我叫廊下另摆两桌，让她们坐着吃罢。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏前 · 6/10",
      "left": "xiangyun",
      "leftExpression": "smile",
      "right": "xifeng",
      "rightExpression": "smile",
      "next": "A7"
    },
    "A7": {
      "speaker": "鸳鸯",
      "line": "二奶奶在这里伺候，我们可吃去了。",
      "source": "原著摘录 · 第三十八回",
      "pageLabel": "游戏前 · 7/10",
      "right": "xifeng",
      "rightExpression": "smile",
      "next": "A8"
    },
    "A8": {
      "speaker": "王熙凤",
      "line": "你们只管去，都交给我就是了。",
      "source": "原著摘录 · 第三十八回",
      "pageLabel": "游戏前 · 8/10",
      "right": "xifeng",
      "rightExpression": "smile",
      "next": "A9"
    },
    "A9": {
      "speaker": "平儿",
      "line": "这桌杯箸有了，那边还缺一份。茶盏搁外边，姜醋另放小碟。东西送来，我在这里接着。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏前 · 9/10",
      "left": "xiangyun",
      "leftExpression": "thoughtful",
      "next": "A10"
    },
    "A10": {
      "speaker": "史湘云",
      "line": "劳你替我接齐螃蟹、姜醋、杯箸和茶盏，交给廊下的平儿。她们也该好好吃一回，别又只顾着伺候人。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏前 · 10/10",
      "left": "xiangyun",
      "leftExpression": "smile",
      "action": "帮忙递送"
    },
    "B1": {
      "speaker": "平儿",
      "line": "齐了，两桌都有份。多亏你接得稳当。这碟蟹放当中，谁吃完了，再添就是。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏后 · 1/8",
      "next": "B2"
    },
    "B2": {
      "speaker": "鸳鸯",
      "line": "奶奶怎么又出来了？才坐下吃两口，倒叫我们又惦记起里头来。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏后 · 2/8",
      "right": "xifeng",
      "rightExpression": "smile",
      "next": "B3"
    },
    "B3": {
      "speaker": "王熙凤",
      "line": "我替你们当差，出来倒受埋怨。还不斟一杯，犒劳犒劳我？",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏后 · 3/8",
      "right": "xifeng",
      "rightExpression": "smile",
      "next": "B4"
    },
    "B4": {
      "speaker": "平儿",
      "line": "酒有了，这里还有一壳剔好的黄子，奶奶尝尝。姜醋也在旁边，省得您又说我们只顾自己受用。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏后 · 4/8",
      "right": "xifeng",
      "rightExpression": "smile",
      "next": "B5"
    },
    "B5": {
      "speaker": "旁白",
      "line": "凤姐吃了蟹，又添姜醋。众人拿她和平儿说笑，平儿佯恼，要拿蟹抹琥珀。琥珀一躲，蟹黄倒误抹在凤姐腮上，廊下顿时笑成一片。",
      "source": "原著情节转述 · 第三十八回",
      "pageLabel": "游戏后 · 5/8",
      "next": "B6"
    },
    "B6": {
      "speaker": "王熙凤",
      "line": "好个平儿！满桌子的蟹不够你吃，偏往我脸上送。快拿水来，我还得进去伺候老太太呢。",
      "source": "游戏改编对白 · 第三十八回",
      "pageLabel": "游戏后 · 6/8",
      "left": "xifeng",
      "leftExpression": "smile",
      "next": "B7"
    },
    "B7": {
      "speaker": "旁白",
      "line": "贾母等人离席后，湘云又请袭人、紫鹃等人吃热蟹，也让桂树下的婆子、小丫头坐下吃喝。众人随后选题作诗，菊花诗渐渐齐了。",
      "source": "原著情节转述 · 第三十八回",
      "pageLabel": "游戏后 · 7/8",
      "left": "xiangyun",
      "leftExpression": "smile",
      "next": "B8"
    },
    "B8": {
      "speaker": "史湘云",
      "line": "宝姐姐，这一回大家都有了吃的，我也能坐着看看花了。我的《对菊》，就用这两句收住——\n“秋光荏苒休辜负，相对原宜惜寸阴。”",
      "source": "改编对白／原著诗句 · 第三十八回 · 史湘云《对菊》",
      "pageLabel": "游戏后 · 8/8",
      "left": "xiangyun",
      "leftExpression": "smile",
      "right": "baochai",
      "rightExpression": "smile",
      "end": true
    }
  }
},
  xiao: {
  "game": "xiao-game.html",
  "title": "潇湘馆 · 燕窝粥备料",
  "scenes": {
    "A0": {
      "speaker": "旁白",
      "line": "近日黛玉嗽疾又重，只在房中将养。这日，宝钗来探望她，说起饮食与调养。",
      "next": "A1"
    },
    "A1": {
      "speaker": "林黛玉",
      "line": "姐姐坐。我这几日精神短，若有照应不到的，你别怪我。茶在这里，你且喝些。",
      "left": "daiyu",
      "right": "baochai",
      "leftExpression": "normal",
      "rightExpression": "normal",
      "next": "A2"
    },
    "A2": {
      "speaker": "薛宝钗",
      "line": "你且安心歇着。我想着，每日早起拿上等燕窝一两，冰糖五钱，用银铫子熬出粥来，饮食上也添些照应。",
      "right": "baochai",
      "rightExpression": "normal",
      "next": "A3"
    },
    "A3": {
      "speaker": "林黛玉",
      "line": "前日你劝我的那些话，我后来想了许久。往日是我多心，错怪了你；今日你又替我这样打算，我心里都知道。",
      "left": "daiyu",
      "leftExpression": "normal",
      "next": "A4"
    },
    "A4": {
      "speaker": "林黛玉",
      "line": "只是请大夫、熬药，已经够烦扰了，再添一碗燕窝粥，底下人未免嫌我多事。我吃穿用度都在这里，总怕又给人添麻烦。",
      "left": "daiyu",
      "right": "baochai",
      "leftExpression": "normal",
      "rightExpression": "normal",
      "next": "A5"
    },
    "A5": {
      "speaker": "薛宝钗",
      "line": "将来也不过多费得一副嫁妆罢了，如今也愁不到这里。",
      "left": "daiyu",
      "right": "baochai",
      "leftExpression": "normal",
      "rightExpression": "smile",
      "next": "A6"
    },
    "A6": {
      "speaker": "林黛玉",
      "line": "人家才拿你当个正经人，把心里的烦难告诉你听，你反拿我取笑儿。",
      "left": "daiyu",
      "leftExpression": "smile",
      "next": "A7"
    },
    "A7": {
      "speaker": "薛宝钗",
      "line": "你才说的也是，多一事不如省一事。我明日家去问问妈妈，家里若有，便送几两来。每日叫丫头们就熬了，又便宜，又不惊师动众的。",
      "right": "baochai",
      "rightExpression": "normal",
      "next": "A8"
    },
    "A8": {
      "speaker": "林黛玉",
      "line": "东西事小，难得你多情如此。你也坐了这半日，我不留你了，晚上再来和我说句话儿。",
      "left": "daiyu",
      "right": "baochai",
      "leftExpression": "smile",
      "rightExpression": "normal",
      "next": "A9"
    },
    "A9": {
      "speaker": "旁白",
      "line": "宝钗走后，黛玉喝了两口稀粥。入夜雨起，她写下《秋窗风雨夕》：“谁家秋院无风入？何处秋窗无雨声？”宝玉冒雨探望，离去后，蘅芜苑又送来了燕窝与糖。",
      "action": "整理来物",
      "background": "xiao-night"
    },
    "B1": {
      "speaker": "蘅芜苑婆子",
      "line": "这一大包是上等燕窝，这一包是洁粉梅片雪花洋糖。姑娘说了，姑娘先吃着，完了再送来。",
      "left": "daiyu",
      "right": "pozi",
      "leftExpression": "normal",
      "rightExpression": "normal",
      "next": "B2",
      "background": "xiao-night"
    },
    "B2": {
      "speaker": "林黛玉",
      "line": "回去替我说声“费心”。你冒雨走这一趟，外头坐坐，吃了茶再去罢。",
      "left": "daiyu",
      "right": "pozi",
      "leftExpression": "smile",
      "rightExpression": "normal",
      "next": "B3",
      "background": "xiao-night"
    },
    "B3": {
      "speaker": "蘅芜苑婆子",
      "line": "不吃茶了，我还赶着夜里的牌局呢。各处上夜的人凑在一处，又坐了更，又解闷儿，今儿还是我的头家。",
      "right": "pozi",
      "rightExpression": "smile",
      "next": "B4",
      "background": "xiao-night"
    },
    "B4": {
      "speaker": "林黛玉",
      "line": "难为你，误了你发财，冒雨送来。给你几百钱，打些酒吃罢。回去路上仔细些。",
      "left": "daiyu",
      "right": "pozi",
      "leftExpression": "smile",
      "rightExpression": "smile",
      "next": "B5",
      "background": "xiao-night"
    },
    "B5": {
      "speaker": "蘅芜苑婆子",
      "line": "又破费姑娘赏酒吃。姑娘的话，我回去就带到；姑娘早些歇着罢。",
      "right": "pozi",
      "rightExpression": "smile",
      "next": "B6",
      "background": "xiao-night"
    },
    "B6": {
      "speaker": "紫鹃",
      "line": "燕窝和送来的糖都收妥了，另备的冰糖也没混进去。银铫子、瓷碗先放好，明早要用时再取，今夜不忙着熬。",
      "left": "daiyu",
      "right": "zijuan",
      "leftExpression": "normal",
      "rightExpression": "normal",
      "next": "B7",
      "background": "xiao-night"
    },
    "B7": {
      "speaker": "林黛玉",
      "line": "明儿若有人往她那里去，记着替我再道一声谢。只别这会儿又叫人冒雨跑一趟了。你也歇歇，咱们明早再理会。",
      "left": "daiyu",
      "right": "zijuan",
      "leftExpression": "smile",
      "rightExpression": "smile",
      "next": "B8",
      "background": "xiao-night"
    },
    "B8": {
      "speaker": "旁白",
      "line": "紫鹃收拾停当，移灯下帘，服侍黛玉睡下。黛玉在枕上感念宝钗，又羡她有母亲、有哥哥；听着竹梢雨声，心事重来，直到四更将阑，才渐渐睡了。",
      "end": true,
      "background": "xiao-night"
    }
  }
}
};

const key = document.body.dataset.chapter;
const chapter = CHAPTERS[key];
const stage = document.getElementById('stage');
const dialogue = document.getElementById('dialogue');
const cta = document.getElementById('cta');
const intro = document.getElementById('intro');
const faces = {xiangyun:'史湘云',daiyu:'林黛玉',baochai:'薛宝钗',zijuan:'紫鹃',liwan:'李纨',maid:'侍女',baoyu:'贾宝玉',xiren:'袭人',pozi:'蘅芜苑婆子',xifeng:'王熙凤'};
let current = 'A0';

function addressScene() {
  const id = new URLSearchParams(location.search).get('scene')?.toUpperCase();
  return Object.hasOwn(chapter.scenes, id) ? id : 'A0';
}
function positionCTA() {
  const bottom = stage.getBoundingClientRect().bottom - dialogue.getBoundingClientRect().top;
  stage.style.setProperty('--dialogue-offset', `${bottom}px`);
}
function show(id, remember = false) {
  const scene = chapter.scenes[id]; current = id;
  stage.classList.toggle('xiao-ending', key === 'xiao' && !!scene.end);
  if (key === 'oux') { const label = document.getElementById('page-label'); if (label) label.textContent = scene.pageLabel || ''; }
  stage.dataset.background = scene.background || '';
  intro.hidden = key === 'xiao' || id !== 'A0'; dialogue.hidden = key !== 'xiao' && id === 'A0';
  document.getElementById('source').textContent = (key === 'xiao' ? '' : scene.source) || '';
  document.getElementById('source').hidden = key === 'xiao' || !scene.source;
  document.getElementById('speaker').textContent = scene.speaker || '';
  document.getElementById('line').textContent = scene.line || '';
  document.getElementById('advance').hidden = !scene.next;
  for (const side of ['left','right']) {
    const image = document.getElementById(`portrait-${side}`);
    image.hidden = !scene[side];
    if (scene[side]) { const person = scene[side]; const expression = scene[`${side}Expression`]; const filename = key === 'xiao' ? `${person}-xiao-${expression === 'smile' ? 'smile' : 'normal'}` : key === 'dao' ? `${person}-dao${expression === 'smile' ? '-smile' : ''}` : key === 'heng' && (person === 'baochai' || person === 'xiangyun') ? `${person}-heng-${expression === 'thoughtful' ? 'thoughtful' : person === 'baochai' ? 'normal' : 'smile'}` : person; image.src = key === 'oux' ? (person === 'xifeng' ? `../eggplant-story/assets/wang-xifeng-${expression === 'smile' ? 'smile' : 'normal'}-v1.png` : `assets/${person === 'xiangyun' ? `xiangyun-heng-${expression === 'thoughtful' ? 'thoughtful' : 'smile'}` : person === 'baochai' ? 'baochai-xiao-smile' : person}.png`) : `assets/${filename}.png`; image.alt = `${faces[person]}${key === 'xiao' ? (expression === 'smile' ? '（含笑）' : person === 'daiyu' ? '（清淡）' : '（平和）') : ''}立绘${expression === 'thoughtful' ? '（思量）' : ''}`; }
  }
  const foodNoteEntry = document.getElementById('food-note-entry'); if (foodNoteEntry) foodNoteEntry.hidden = !((key === 'dao' && id === 'B12') || (key === 'heng' && id === 'B13') || (key === 'oux' && id === 'B8'));
  cta.hidden = (!scene.action && !scene.end) || (key === 'dao' && id === 'B12') || (key === 'heng' && id === 'B13') || (key === 'oux' && id === 'B8'); cta.disabled = false; if (scene.action || scene.end) cta.textContent = scene.end ? (key === 'xiao' ? '查看雨夜燕窝食笺' : '结束剧情') : scene.action;
  if (key === 'xiao' && id === 'A0') { cta.hidden = false; cta.textContent = '入梦'; }
  const back = document.getElementById('return-garden'); if (back) back.hidden = !scene.end;
  dialogue.tabIndex = scene.next ? 0 : -1;
  dialogue.setAttribute('aria-label', scene.next ? '继续剧情' : '当前剧情结束');
  if (remember) { const params = new URLSearchParams(location.search); params.set('scene', id); history.pushState({scene:id}, '', `${location.pathname}?${params}`); }
  requestAnimationFrame(positionCTA);
}
function advance() { const next = chapter.scenes[current].next; if (next) show(next, true); }
document.getElementById('intro-next').addEventListener('click', advance);
dialogue.addEventListener('click', advance);
dialogue.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); } });
cta.addEventListener('click', () => { if (key === 'xiao' && current === 'A0') { advance(); return; } if (key === 'xiao' && chapter.scenes[current].end) { location.href = '../xiao-food-note.html'; return; } if (chapter.scenes[current].end) { cta.textContent = '剧情已结束'; cta.disabled = true; } else { location.href = chapter.game; } });
window.addEventListener('popstate', () => show(addressScene()));
window.addEventListener('resize', positionCTA);
new ResizeObserver(positionCTA).observe(dialogue);
show(addressScene());
