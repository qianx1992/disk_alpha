var handle = {
	csType:"zhong",
	initFn:function(){
		var idNum=1;
		var obj=handle.getById(idNum);
		handle.cteateTree();
		handle.createRight(obj);
		handle.createNav(obj);
		handle.openPath(idNum);
	},
	changeShape:function(){
		var changeBtn=document.querySelector(".changeBtn");
		changeBtn.cz=false;
		changeBtn.onclick=function(){
			if(!changeBtn.cz){
				handle.csType="heng";
			}else{
				handle.csType="zhong";
			}
			changeBtn.cz=!changeBtn.cz;
			var rlDivTwo=document.querySelector(".rlDivTwo");
			rlDivTwo.classList.toggle("disp");
			var rlDivOne=document.querySelector(".rlDivOne");
			rlDivOne.classList.toggle("NoDisp");
			var pid=handle.getCurrPid();
			handle.createRight(handle.getById(pid));
		}
	},
	getByPId: function(pid) {
		return fileData.filter(function(item) {
			return item.pid === pid;
		});
	},
	formHtmlByPId: function(pid, marginInit) {
		var str = "";
		var arr = this.getByPId(pid);
		if(arr.length == 0) {
			return str;
		}
		var marginLeft = marginInit;
		var specH3 = "";
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].pid == 0) {
				specH3 = "first";
			} else if(arr[i].pid == 1) {
				specH3 = "second";
			}
			if(this.getByPId(arr[i].id).length == 0) {
				str += "<li><h3 class='" + specH3 + "' index='"+
				arr[i].id+"'><em style='margin-left:" + marginLeft + "px;'></em><span class='nodeName'><span class='" +
				arr[i].type + "'></span>" + arr[i].name + "</span></h3></<li>";
			} else {
				var a = marginLeft + 20;
				str += "<li><h3 class='" + specH3 + " rightH3' index='"+
				arr[i].id+"'><em style='margin-left:" +
				marginLeft + "px;'></em><span class='nodeName'><span class='" +
				arr[i].type + "'></span>" + arr[i].name + "</span></h3><ul>" + this.formHtmlByPId(arr[i].id, a) + "</ul><li>";
			}
		}
		return str;
	},
	sMoveFn:function(){
		/*var rldoList=document.querySelector(".rldoList");*/
		var liSects=document.querySelectorAll(".liSelected");
		if(liSects.length==0){
			var warnSelct=document.querySelector(".warnSelct");			
			warnSelct.classList.add("disp");
			handle.warnFn(warnSelct);
		}else{
			var sbTree=document.querySelector(".sbTree");
			sbTree.innerHTML=handle.formHtmlByPId(0, 5);
			var ems=sbTree.querySelectorAll("h3 em");
			handle.emClick(ems);
			var h3s=sbTree.querySelectorAll("h3");
			idName="index";
			h3s.forEach(function(item){
				item.onclick=function(){
					var tarIds=[];
					tarIds=handle.addtionOther(liSects);
					for(var i=0;i<h3s.length;i++){
						if(item.getAttribute(idName)!=h3s[i].getAttribute(idName)){
							h3s[i].classList.remove("goInto");
						}
					}
					if(tarIds.indexOf(parseFloat(item.getAttribute(idName)))==-1){
						item.classList.toggle("goInto");
					}else{
						item.style.cursor="not-allowed";
					}
				}
			});
			var storeBox=document.querySelector(".storeBox");
			handle.dialogFn(storeBox,function(){
				handle.moveRequire(idName,liSects);
			},-800);
		}
	},
	cteateTree: function() {
		var leftBox = document.querySelector(".leftBox");
		leftBox.innerHTML = this.formHtmlByPId(0, 10);
		leftBox.querySelectorAll("h3").forEach(function(item){
			item.onclick=function(){
				var obj=handle.getById(parseInt(this.getAttribute("index")));
				handle.createRight(obj);
				handle.createNav(obj);
			}
		});
		var ems=leftBox.querySelectorAll("h3 em");
		handle.emClick(ems);
	},
	emClick:function(ems){
		ems.forEach(function(item){
			if(item.parentNode.nextElementSibling){
				item.onclick = function(e) {
					var parentH3=this.parentNode;
					if(parentH3.classList.contains("downH3")) {
						parentH3.nextElementSibling.querySelectorAll("h3[class~='downH3']").forEach(function(item) {
							item.classList.add("rightH3");
							item.classList.remove("downH3");
						});
					}
					parentH3.classList.toggle("rightH3");
					parentH3.classList.toggle("downH3");
					e.cancelBubble=true;
				}
			}	
		});
	},
	getById:function(id){
		for(var i=0;i<fileData.length;i++){
			if(fileData[i].id==id){
				return fileData[i];				
			}
		}
	},
	createRLi:function(obj,csType){
		var li=document.createElement("li");
		li.setAttribute("idNum",obj.id);
		li.classList.add("item");
		var parentOb;
		if(csType=="heng"){
			parentOb=document.querySelector(".rdtwoList");
			li.innerHTML="<div><input type='text' value='"+
			obj.name+"'/></div><nav class='funcNav'><a href='javascript:;'></a><a href='javascript:;'></a><a href='javascript:;'></a><a href='javascript:;'></a><a href='javascript:;'></a></nav><time>"+
			obj.time+"</time>";
		}else{
			parentOb=document.querySelector(".rldoList");
			if(obj.type=="folder" || obj.type=="file"){
				var imgType= imgData[0];
			}
			li.innerHTML="<img src='img/"+imgType+"'/><input type='text' value='"+
			obj.name+"' disabled='true'/>";
		}
		var rClickBox=document.querySelector(".rClickBox");
		li.onclick=function(e){
			//判断事件源是否为input
			if(e.target.nodeName=="INPUT" &&
			li.classList.contains("liSelected")){				
				if(csType=="heng"){
					li.children[0].children[0].disabled=false;
					li.children[0].children[0].focus();
				}else{
					li.children[1].disabled=false;
					li.children[1].focus();
					return;
				}
			}
			if(!e.ctrlKey){
				parentOb.querySelectorAll("li").forEach(function(item){
					if(item.getAttribute("idNum")!=li.getAttribute("idNum")){
						item.classList.remove("liSelected");
						if(handle.csType=="heng"){
							item.children[0].children[0].blur();
						}else{
							item.children[1].blur();
						}
					}
				});	
			}
			this.classList.toggle("liSelected");
			rClickBox.style.cssText="";
			e.cancelBubble=true;
		}
		li.onmousedown=function(e){
			if(e.button==2){
				parentOb.querySelectorAll("li").forEach(function(item){
					if(item.getAttribute("idNum")!=li.getAttribute("idNum")){
						item.classList.remove("liSelected");
					}
				});
				this.classList.add("liSelected");
				if(csType!="heng"){
					li.onmouseup=function(){
						rClickBox.style.cssText="display: block; left: "+
						(li.offsetLeft+li.offsetWidth)+"px; top: "+
						(li.offsetTop+li.offsetHeight/2)+"px;";
						var idNum=parseInt(li.getAttribute("idNum"));
						
						if(handle.getByPId(idNum).length==0){
							rClickBox.children[0].classList.add("notAllowed");
						}else{
							rClickBox.children[0].classList.remove("notAllowed");
							rClickBox.children[0].onclick=function(){									
								var ob=handle.getById(idNum);
								handle.openPath(idNum);
								handle.createNav(ob);
								handle.createRight(ob);
								rClickBox.style.cssText="";
							}
						}						
						rClickBox.children[1].onclick=function(){
							handle.addNew(obj.id);
							rClickBox.style.cssText="";
						}
						rClickBox.children[2].onclick=function(){
							handle.del();
							rClickBox.style.cssText="";
						}
						rClickBox.children[3].onclick=function(){
							li.children[1].disabled=false;
							li.children[1].focus();
							rClickBox.style.cssText="";
						}
						rClickBox.children[4].onclick=function(){
							handle.sMoveFn();
							rClickBox.style.cssText="";
						}
						li.onmouseup=null;
					}
				}
				
			}
			return false;
			e.cancelBubble=true;
		};
		li.ondblclick=function(e){
			var idNum=parseInt(this.getAttribute("idNum"));
			var ob=handle.getById(idNum);
			handle.openPath(idNum);
			handle.createNav(ob);
			handle.createRight(ob);
			/*e.cancelBubble=true;*/
			console.log("双击");
		}
		var inp;
		if(csType=="heng"){
			var funcNav=li.querySelector(".funcNav");
			funcNav.children[1].onclick=funcNav.children[0].onclick=function(e){
				li.classList.add("liSelected");
				e.cancelBubble=true;
			}
			funcNav.children[2].onclick=function(e){
				li.classList.add("liSelected");
				handle.sMoveFn();
				e.cancelBubble=true;
			}
			funcNav.children[3].onclick=function(e){
				li.classList.add("liSelected");
				li.children[0].children[0].disabled=false;
				li.children[0].children[0].focus();
				e.cancelBubble=true;
			}
			funcNav.children[4].onclick=function(e){
				li.classList.add("liSelected");
				handle.del();
				e.cancelBubble=true;
			}
			inp=li.children[0].children[0];
		}else{
			inp=li.children[1];
		}
		inp.onfocus=function(){
			this.classList.add("focusd");
		}
		inp.onblur=function(){
			var newValue=this.value.trim();
			var id=parseInt(li.getAttribute("idNum"));
			var liData=handle.getById(id);
			if(handle.checkName(id,newValue,liData.pid)){
				this.classList.add("error");
				this.focus();
			}else{
				this.disabled=true;
				this.classList.remove("error");
				this.classList.remove("focusd");
				liData.name=newValue;
				handle.cteateTree();
				handle.openPath(liData.pid);
			}
		}
		return li;
	},
	checkName:function(id,newValue,pid){
		return fileData.some(function(item){
			return (item.name==newValue && item.pid==pid && 
				item.id!=id);
		});
	},
	createRight: function(obj){
		var parentOb;
		var csType=handle.csType;
		if(csType=="heng"){
			parentOb=document.querySelector(".rdtwoList");
		}else{
			parentOb=document.querySelector(".rldoList");
		}
		parentOb.innerHTML="";
		var noResult=document.querySelector(".noResult");
		var arr=handle.getByPId(obj.id);
		if(arr.length==0){
			noResult.style.display="block";
		}else{
			noResult.style.display="";
			for(var j=0;j<arr.length;j++){
				parentOb.appendChild(handle.createRLi(arr[j],csType));
			}
		}
	},
	openPath:function(idNum){
		 var leftBox = document.querySelector(".leftBox");
		 fn(idNum);
		 function fn(idNum){
		 	var el=leftBox.querySelector("li h3[index='"+idNum+"']");
		 	if(el.classList.contains("rightH3")){
		 		el.classList.add("downH3");
		 		el.classList.remove("rightH3");
		 	}
		 	if(handle.getById(handle.getById(idNum).pid)){
		 		fn(handle.getById(idNum).pid);
		 	}	 	
		 }
	},
	createNav:function(obj){
		var rbtList=document.querySelector(".rbtList");
		var str="";
		for(var j=0;obj;j++){
			if(j==0){
				str="<li><a href='javascript:;' aIndex='"+
				obj.id+"' class='aActive'>"+obj.name+"</a></li>"+str;
			}else{
				str="<li><a href='javascript:;' aIndex='"+
				obj.id+"'>"+obj.name+"</a><span></span></li>"+str;
			}
			obj=handle.getById(obj.pid);
		}
		rbtList.innerHTML=str;
		rbtList.querySelectorAll(".rbtList a").forEach(function(item){
			item.onclick=function(){
				var ob=handle.getById(parseInt(this.getAttribute("aIndex")));
				handle.createNav(ob);
				handle.createRight(ob);
			}
		});
	},
	addNew:function(pid){
		var rldoList=document.querySelector(".rldoList");		
		var id=fileData[fileData.length-1].id+1;
		var obj={
			"id":id,
			"name":handle.dealReName(id,"新建文件夹",pid),
			"type":"folder",
			"pid":pid,
			"time":new Date().getFullYear()+"-"+
			addZero(new Date().getMonth()+1)+"-"+addZero(new Date().getDate())
			+" "+addZero(new Date().getHours())+":"+addZero(new Date().getMinutes())
		};
		function addZero(n){
			return n>9?""+n:"0"+n;
		}
		fileData.push(obj);
		handle.cteateTree();
		handle.openPath(pid);
		handle.createNav(handle.getById(pid));
		handle.createRight(handle.getById(pid));
		var li=rldoList.lastElementChild;
		li.children[1].disabled=false;
		li.children[1].focus();
	},
	//处理重命名情况
	dealReName:function(id,initName,pid){
		var num=0;
		var newValue=initName;
		function fn(id,initName,newValue,pid){
			if(handle.checkName(id,newValue,pid)){
				num++;
				newValue=initName+"_"+num;
				return fn(id,initName,newValue,pid);
			}
			return newValue;
		}
		return fn(id,initName,newValue,pid);
	},
	//获取当前在哪个文件夹下
	getCurrPid:function(){
		var rbtList=document.querySelector(".rbtList");
		var nowA=rbtList.lastElementChild.children[0];
		return parseInt(nowA.getAttribute("aindex"));
	},
	//删除方法
	del:function(){
		var delObjs=document.querySelectorAll(".liSelected");
		if(delObjs.length==0){
			var warnSelct=document.querySelector(".warnSelct");
			warnSelct.classList.add("disp");
			handle.warnFn(warnSelct);
		}else{
			var dbcRight=document.querySelector(".dbcRight");
				dbcRight.innerHTML="<h3>确定要删除这个文件夹吗？</h3><p>已删除的文件可以在回收站找到</p>";
			var deleteBox=document.querySelector(".deleteBox");
			handle.dialogFn(deleteBox,function(){
				var deleting=document.querySelector(".deleting");
				var delCon=deleting.querySelector("p");
				delCon.innerHTML="正在删除中";
				handle.dialogFn(deleting,function(){
					delFn(delObjs);
					var warnDelSucess=document.querySelector(".warnDelSucess");
					warnDelSucess.innerHTML="清除文件成功";
					warnDelSucess.classList.add("disp");
					handle.warnFn(warnDelSucess);
				},-500);
				
			},-500);
			
		}
		function delFn(delObjs){
			var parentOb;
			if(handle.csType=="heng"){
				parentOb=document.querySelector(".rdtwoList");
			}else{
				parentOb=document.querySelector(".rldoList");
			}
			var delIds=[];
			delObjs.forEach(function(item){
				var idNum=parseInt(item.getAttribute("idNum"));
				delIds.push(idNum);
				var delh3=document.querySelector(".leftBox h3[index='"+idNum+"']");
				if(delh3.nextElementSibling){
					delh3.nextElementSibling.querySelectorAll("h3").
					forEach(function(it){
						delIds.push(parseInt(it.getAttribute("idNum")));
					});
				}
				delh3.parentNode.parentNode.removeChild(delh3.parentNode);
				parentOb.removeChild(item);
			});
			fileData=fileData.filter(function(item){
				return delIds.indexOf(item.id)==-1;
			});
		}
	},
	//头部导航条按钮操作
	navBoxBtn:function(){
		var del=document.querySelector(".delFile");
		del.onclick=function(){			
			handle.del();
		}
		var createFile = document.querySelector(".createFile");
		createFile.onclick=function(){
			handle.addNew(handle.getCurrPid());
		};
		var moveToBtn=document.querySelector(".moveToBtn");
		moveToBtn.onclick=function(){
			handle.sMoveFn();
		}
		var renameBtn=document.querySelector(".renameBtn");
		renameBtn.onclick=function(){
			var liSects=document.querySelectorAll(".rldoList .liSelected");
			if(liSects.length==0 || liSects.length>1){
				var warnSelct=document.querySelector(".warnSelct");
				if(liSects.length>1){
					warnSelct.innerHTML="重命名操作只针对单个文件有效!";
				}
				warnSelct.classList.add("disp");
				handle.warnFn(warnSelct);
			}else{
				console.log(liSects[0]);
				liSects[0].children[1].disabled=false;
				liSects[0].children[1].focus();
			}
		}
		var refreshAll=document.querySelector(".refreshAll");
		refreshAll.onclick=function(){
			var deleting=document.querySelector(".deleting");
			var delCon=deleting.querySelector("p");
			delCon.innerHTML="正在更新中";
			handle.dialogFn(deleting,function(){
				handle.initFn();
				var warnDelSucess=document.querySelector(".warnDelSucess");
				warnDelSucess.innerHTML="已更新完成！";
				warnDelSucess.classList.add("disp");
				handle.warnFn(warnDelSucess);
			},-500);
		}
	},
	//对话框操作
	dialogFn:function(el,tab,dis){
		var dialogBox=document.querySelector(".dialogBox");
		dialogBox.classList.add("disp");
		mTween({
			el:el,
			target:{"marginBottom":0},
			time:50,
			type:"easeIn",
			callBack:function(){
				var sure=el.querySelector(".sure");
				var cancel=el.querySelector(".cancel");
				var closed=el.querySelector(".closed");
				if(!cancel || !closed || !sure){
					setTimeout(function(){
						btnFn(tab);
					},2000);
					return;
				}
				cancel.addEventListener("click",btnFn);
				closed.addEventListener("click",btnFn);
				sure.onclick=function(){
					btnFn(tab);
				}
			}
		});
		
		function btnFn(tab){					
			mTween({
				el:el,
				target:{"marginBottom":dis},
				time:100,
				type:"easeOut",
				callBack:function(){
					dialogBox.classList.remove("disp");
					tab&&tab();
				}
			});
		}
	},
	//提示框操作
	warnFn:function(el){
		mTween({
			el:el,
			target:{"marginTop":0},
			time:80,
			type:"easeIn",
			callBack:function(){
				setTimeout(function(){
					mTween({
						el:el,
						target:{"marginTop":-500},
						time:300,
						type:"easeOut",
						callBack:function(){
							el.classList.remove("disp");
						}
					});
				},4000);
			}
		});
	},
	addDocumentEvent:function(){
		document.oncontextmenu = function(){
			return false;
		}
		var mRight=document.getElementById("mRight");
		var keyName="";
		document.onmousedown=function(){
			return false;
		}
		document.onclick=function(e){
			if(handle.csType=="heng"){
				keyName="rdtwoList";
			}else{
				keyName="rldoList";
			}			
			mRight.querySelectorAll(".liSelected").forEach(function(item){
				item.classList.remove("liSelected");
			});
			if(e.target.classList.contains(keyName)){
				mRight.querySelectorAll("."+keyName+" li").forEach(function(item){									
					if(handle.csType=="heng"){
						item.children[0].children[0].blur();
					}else{
						item.children[1].blur();
					}				
				});
			}
			var rClickBox=document.querySelector(".rClickBox");
			rClickBox.style.cssText="";
			
		}
		mRight.onmousedown=function(ev){
			console.log("qxqx");
			if(handle.csType=="heng"){
				keyName="rdtwoList";
			}else{
				keyName="rldoList";
			}
			var recOri={
					x:ev.clientX,
					y:ev.clientY
				};
			var knOb=document.querySelector("."+keyName);
			var rldoBoud=knOb.getBoundingClientRect();
			if(ev.target.classList.contains(keyName)){
				var rect=document.createElement("li");
				rect.id="rect";
				knOb.appendChild(rect);
				var recNowX=0,recNowY=0;
				document.onmousemove=function(ev){
					recNowX=ev.clientX;
					recNowY=ev.clientY;
					rect.style.cssText="width:"+Math.abs(recNowX-recOri.x)+
					"px; height:"+Math.abs(recNowY-recOri.y)+"px; left:"+
					(Math.min(recOri.x,recNowX)-rldoBoud.left)+"px; top:"+
					(Math.min(recOri.y,recNowY)-rldoBoud.top)+"px;";
					var lis=knOb.querySelectorAll(".item");
					lis.forEach(function(item){
						var itemBoud=item.getBoundingClientRect();
						var rectBoud=rect.getBoundingClientRect();
						if(rectBoud.right<itemBoud.left ||
						rectBoud.left>itemBoud.right||rectBoud.bottom<itemBoud.top||
						rectBoud.top>itemBoud.bottom){
							item.classList.remove("liSelected");
						}else{
							item.classList.add("liSelected");
						}
					});
				}
				document.onmouseup=function(){
					knOb.removeChild(rect);
					document.onmousemove=document.onmouseup=null;
				}
			}else if(ev.target.classList.contains("liSelected") ||
			ev.target.parentNode.classList.contains("liSelected")){
				var middle=document.querySelector(".middle");
				var liSects=knOb.querySelectorAll(".liSelected");
				var tarIds=handle.addtionOther(liSects);
				var leftBox=document.querySelector(".leftBox");
				var budget=document.createElement("div");
				budget.id="budget";
				var span=document.createElement("span");
				span.innerHTML=liSects.length;
				budget.style.display="none";
				budget.appendChild(span);
				middle.appendChild(budget);//
				var bwid=budget.offsetWidth,bHei=budget.offsetHeight;
				var middBound=middle.getBoundingClientRect();
				var nowX,nowY,aimEl,nowBound,idName="";
				document.onmousemove=function(ev){
					if( Math.abs(ev.clientX-recOri.x)>50 ||
					Math.abs(ev.clientY-recOri.y)>50){
						budget.style.display="block";
					}
					nowX=ev.clientX;
					nowY=ev.clientY;
					budget.style.left=(nowX-bwid/2-middBound.left)+"px";
					budget.style.top=(nowY-bHei/2-middBound.top)+"px";
					if(nowX>leftBox.offsetWidth){
						idName="idNum";
						aimEl=knOb.querySelectorAll(".item:not(.liSelected)");//object NodeList
						aimEl.forEach(function(item){
							var aimBound=item.getBoundingClientRect();
							if(nowX<aimBound.right && nowX>aimBound.left &&
							nowY<aimBound.bottom && nowY>aimBound.top){
								item.classList.add("goInto");
							}else{
								item.classList.remove("goInto");
							}
						});
					}else{
						var budgetBound=budget.getBoundingClientRect();
						leftBox.querySelectorAll("h3").forEach(function(item){
							idName="index";
							var aimBound=item.getBoundingClientRect();
							if(budgetBound.bottom>aimBound.bottom &&
								budgetBound.top<aimBound.top &&
							tarIds.indexOf(parseFloat(item.getAttribute(idName)))==-1){
								item.classList.add("goInto");
							}else{
								item.classList.remove("goInto");
							}
						});
					}
				}
				document.onmouseup=function(){
					handle.moveRequire(idName,liSects);
					middle.removeChild(budget);
					document.onmousemove=document.onmouseup=null;
				}
			}
			return false;
		}
	},
	moveFileEnd:function(liSects,targetId){
		Array.from(liSects).map(function(item){
			return handle.getById(parseInt(item.getAttribute("idNum")));
		}).forEach(function(item){
			return item.pid=targetId;
		});
		var obj=handle.getById(targetId);
		handle.cteateTree();
		handle.createNav(obj);
		handle.createRight(obj);//id
		handle.openPath(targetId);//id
	},
	//鼠标移动后抬起操作
	moveRequire:function(idName,liSects){
		var target=document.querySelector(".goInto");
		if(target){
			var targetId=parseInt(target.getAttribute(idName));
			var tarNames=handle.getByPId(targetId).map(function(item){
					return item.name;
			});
			var aimNames=Array.from(liSects).map(function(item){
				if(handle.csType=="heng"){
					return item.children[0].children[0].value;
				}else{
					return item.children[1].value;
				}
			});
			if(tarNames.concat(aimNames).length==new Set(tarNames.concat(aimNames)).size){
				handle.moveFileEnd(liSects,targetId);
				//此时重新渲染，就不用删除badge
			}else{
				var repeatName="",rNameArr=[],newName="",rnId;
				for(var i=0;i<tarNames.length;i++){
					if(aimNames.indexOf(tarNames[i])!=-1){
						rNameArr.push(tarNames[i]);
						continue;
					}
				}
				var newNameArr=[],rnIdArr=[];
				for(var i=0;i<liSects.length;i++){
					rnId=liSects[i].getAttribute("idNum");
					var ob=handle.getById(rnId);
					if(rNameArr.indexOf(ob.name)==-1){
						continue;
					}
					newName=handle.dealReName(rnId,ob.name,targetId);
					if(newName!=""){
						newNameArr.push(newName);
						rnIdArr.push(rnId);						
					}
				}
				var deleteBox=document.querySelector(".deleteBox");
				var dbcRight=document.querySelector(".dbcRight");
				dbcRight.innerHTML="<h3>要移动的文件夹和目标文件夹有重复名，要继续吗？</h3>";
				handle.dialogFn(deleteBox,function(){
					for(var i=0;i<newNameArr.length;i++){
						handle.getById(rnIdArr[i]).name=newNameArr[i];
					}
					handle.moveFileEnd(liSects,targetId);
						
				},-500);
			}
			target.classList.remove("goInto");
		}
	},
	addtionOther:function(liSects){
		var tarIds=[];
		var leftBox=document.querySelector(".leftBox");
		liSects.forEach(function(item){
			var id=parseInt(item.getAttribute("idNum"));
			tarIds.push(id);
			var h3=leftBox.querySelector("h3[index='"+id+"']");
			if(h3.nextElementSibling){
				h3.nextElementSibling.querySelectorAll("h3").forEach(function(it){
					tarIds.push(parseInt(it.getAttribute("index")));
				});
			}
		});
		return tarIds;
	}
}	