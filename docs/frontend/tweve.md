---
title: JavaScript与多线程的不解之缘！
---
<section id="nice" data-tool="mdnice编辑器" data-website="https://www.mdnice.com" style="font-size: 16px; padding: 0 10px; word-spacing: 0px; word-break: break-word; word-wrap: break-word; text-align: left; line-height: 1.75; color: #595959; font-family: Optima-Regular, Optima, PingFangTC-Light, PingFangSC-light, PingFangTC-light; letter-spacing: 2px; background-image: linear-gradient(90deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%), linear-gradient(360deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%); background-size: 20px 20px; background-position: center center;"><h2 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 22px; text-align: left; margin: 20px 10px 0px 0px;"><span class="prefix" style="display: none;"></span><span class="content" style="font-size: 18px; font-weight: bold; display: inline-block; padding-left: 10px; border-left: 5px solid #DEC6FB; color: #595959;">前言</span><span class="suffix"></span></h2>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">对于前端开发者来说，多线程是一个比较陌生的话题。因为JavaScript是单线程语言。也就是说，所有任务只能在一个线程上完成，一次只能做一件事。前面的任务没做完，后面的任务只能等着。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">UI渲染与JavaScript是共同使用主线程。如果JavaScript运行过长，可能就会中断UI渲染，从而导致页面卡顿。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">为此，JavaScript推出了异步的处理方法。但终归到底还是单线程的。而且随着电脑计算能力的增强，尤其是多核CPU的出现，单线程带来很大的不便，无法充分发挥计算机的计算能力。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">Web Workers就应运而生了。通过使用Web Workers，Web应用程序可以在独立于主线程的后台线程中，运行一个脚本操作。这样做的好处是可以在独立线程中执行费时的处理任务，主线程从而不会因此被阻塞。</p>
<h2 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 22px; text-align: left; margin: 20px 10px 0px 0px;"><span class="prefix" style="display: none;"></span><span class="content" style="font-size: 18px; font-weight: bold; display: inline-block; padding-left: 10px; border-left: 5px solid #DEC6FB; color: #595959;">多线程</span><span class="suffix"></span></h2>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">我们从熟悉的领域入手来了解多线程是什么。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">通常从事开发的同学都对计算机配置有一定的了解，知道CPU配置中都标明几核几线程。比如说6核12线程、8核16线程等。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;"><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/4/17317bd78a3c61dd~tplv-t2oaga2asx-image.image" alt style="max-width: 100%; border-radius: 6px; display: block; margin: 20px auto; object-fit: contain;">（电脑比较渣，只有2核4线程）</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">一般来说：一个CPU有几核就可以跑几个线程，比如说二核二线程--说明这个CPU同时最多能够运行两个线程，而二核四线程是使用了超线程技术，使得单个核像有两个核一样，速度要比二核二线程要快。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">了解了基本信息之后，来看看JavaScript的多线程--web workers。</p>
<h3 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; color: black; font-size: 16px; font-weight: bold; text-align: center;"><span class="prefix" style="display: none;"></span><span class="content" style="border-bottom: 2px solid #DEC6FB; color: #595959;">web workers</span><span class="suffix" style="display: none;"></span></h3>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">HTML5引入了Web Workers，让JavaScript支持多线程。接下来用Web Workers做一个斐波那契函数来举例：</p>
<pre class="custom" data-tool="mdnice编辑器" style="margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px;"><span style="display: block; background: url(https://imgkr.cn-bj.ufileos.com/97e4eed2-a992-4976-acf0-ccb6fb34d308.png); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #1E1E1E; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #DCDCDC; display: block; font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; font-size: 12px; -webkit-overflow-scrolling: touch; padding-top: 15px; background: #1E1E1E; border-radius: 5px;">// worker.js
<span/><span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> fibonacci(n) {
<span/>    <span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> fib(n, v1, v2) {
<span/>        <span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">if</span> (n == 1)
<span/>            <span class="hljs-built_in" style="color: #4EC9B0; line-height: 26px;">return</span> v1;
<span/>        <span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">if</span> (n == 2)
<span/>            <span class="hljs-built_in" style="color: #4EC9B0; line-height: 26px;">return</span> v2;
<span/>        <span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">else</span>
<span/>            <span class="hljs-built_in" style="color: #4EC9B0; line-height: 26px;">return</span> fib(n - 1, v2, v1 + v2);
<span/>    }
<span/>    <span class="hljs-built_in" style="color: #4EC9B0; line-height: 26px;">return</span> fib(n, 1, 1)
<span/>}
<span/>
<span/>// 通过onmessage回调函数接收主线程的数据
<span/>onmessage = <span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> (e) {
<span/>    // 通过e.data接收从主线程中传过来的数据。
<span/>    var num = e.data;
<span/>    var result = fibonacci(num);
<span/>    // 通过postMessage向主线程传输结果。
<span/>    postMessage(result);
<span/>}
<span/></code></pre>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">把这个函数写到worker.js中。接着在index.js文件中使用new关键字，调用Worker()构造函数，新建一个Worker线程。</p>
<pre class="custom" data-tool="mdnice编辑器" style="margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px;"><span style="display: block; background: url(https://imgkr.cn-bj.ufileos.com/97e4eed2-a992-4976-acf0-ccb6fb34d308.png); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #1E1E1E; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #DCDCDC; display: block; font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; font-size: 12px; -webkit-overflow-scrolling: touch; padding-top: 15px; background: #1E1E1E; border-radius: 5px;">// index.js
<span/>var worker = new Worker(<span class="hljs-string" style="color: #D69D85; line-height: 26px;">'worker.js文件的url'</span>);
<span/>
<span/>worker.onmessage = <span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> (e) {
<span/>    console.log(<span class="hljs-string" style="color: #D69D85; line-height: 26px;">"result: "</span> + e.data);
<span/>}
<span/>worker.postMessage(100);
<span/>
<span/>worker.terminate();
<span/></code></pre>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">Worker()构造函数的参数是刚刚定义的worker脚本文件。但是Worker构造函数不能读取本地文件，所以这个脚本必须来自网络。然后，调用worker.postMessage()方法，向Worker发消息。最后，主通过worker.onmessage指定监听函数，接收Worker发回来的消息。Worker完成任务以后，就可以把它关掉。</p>
<h3 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; color: black; font-size: 16px; font-weight: bold; text-align: center;"><span class="prefix" style="display: none;"></span><span class="content" style="border-bottom: 2px solid #DEC6FB; color: #595959;">数据通信</span><span class="suffix" style="display: none;"></span></h3>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">主线程与Worker之间的通信内容，可以是基本类型的，也可以是引用类型的，而且是通过值传递的。Worker对通信内容的修改，不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容通过类似JSON.stringify()的api将内容转为字符串，再传给Worker，后者将其还原。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">正如所想的那样，这种方式会造成性能问题。当主线程向Worker发送几百上千兆大小的文件，默认情况下浏览器会将其拷贝一份。为了解决这个问题，JavaScript允许主线程通过TransferableObjects方法把数据直接转移给Worker线程，但是一旦传输了，主线程就再也无法使用这些数据了。这是为了防止出现多个线程同时处理数据的风险。</p>
<pre class="custom" data-tool="mdnice编辑器" style="margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px;"><span style="display: block; background: url(https://imgkr.cn-bj.ufileos.com/97e4eed2-a992-4976-acf0-ccb6fb34d308.png); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #1E1E1E; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #DCDCDC; display: block; font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; font-size: 12px; -webkit-overflow-scrolling: touch; padding-top: 15px; background: #1E1E1E; border-radius: 5px;">// Transferable Objects 格式
<span/>worker.postMessage(arrayBuffer, [arrayBuffer]);
<span/>
<span/>// 例子
<span/>var ab = new ArrayBuffer(1);
<span/>worker.postMessage(ab, [ab]);
<span/></code></pre>
<h3 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; color: black; font-size: 16px; font-weight: bold; text-align: center;"><span class="prefix" style="display: none;"></span><span class="content" style="border-bottom: 2px solid #DEC6FB; color: #595959;">内联Web Worker</span><span class="suffix" style="display: none;"></span></h3>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">一般来说，Web Worker的载入是一个单独的JavaScript脚本文件，但也是可以与主线程用一个文件中载入：</p>
<pre class="custom" data-tool="mdnice编辑器" style="margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px;"><span style="display: block; background: url(https://imgkr.cn-bj.ufileos.com/97e4eed2-a992-4976-acf0-ccb6fb34d308.png); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #1E1E1E; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #DCDCDC; display: block; font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; font-size: 12px; -webkit-overflow-scrolling: touch; padding-top: 15px; background: #1E1E1E; border-radius: 5px;">&lt;!DOCTYPE html&gt;
<span/>    &lt;body&gt;
<span/>        &lt;script id=<span class="hljs-string" style="color: #D69D85; line-height: 26px;">'worker'</span> <span class="hljs-built_in" style="color: #4EC9B0; line-height: 26px;">type</span>=<span class="hljs-string" style="color: #D69D85; line-height: 26px;">'app/worker'</span>&gt;
<span/>            <span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> fibonacci(n) {
<span/>               ...
<span/>            }
<span/>            
<span/>            // 通过onmessage回调函数接收主线程的数据
<span/>            onmessage = <span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> (e) {
<span/>                // 通过e.data接收从主线程中传过来的数据。
<span/>                var num = e.data;
<span/>                var result = fibonacci(num);
<span/>                // 通过postMessage向主线程传输结果。
<span/>                postMessage(result);
<span/>            }
<span/>        &lt;/script&gt;
<span/>    &lt;/body&gt;
<span/>&lt;/html&gt;
<span/></code></pre>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">必须指定<code style="font-size: 14px; word-wrap: break-word; padding: 2px 4px; border-radius: 4px; margin: 0 2px; background-color: rgba(27,31,35,.05); font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; word-break: break-all; color: #595959;">&lt;script&gt;</code>标签的type属性是一个浏览器不认识的值，比如app/worker</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">然后，读取这段嵌入页面的脚本，用Worker来处理</p>
<pre class="custom" data-tool="mdnice编辑器" style="margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px;"><span style="display: block; background: url(https://imgkr.cn-bj.ufileos.com/97e4eed2-a992-4976-acf0-ccb6fb34d308.png); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #1E1E1E; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #DCDCDC; display: block; font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; font-size: 12px; -webkit-overflow-scrolling: touch; padding-top: 15px; background: #1E1E1E; border-radius: 5px;">var blob = new Blob([document.querySelector(<span class="hljs-string" style="color: #D69D85; line-height: 26px;">'#worker'</span>).textContent]);
<span/>var url = window.URL.createObjectURL(blob);
<span/>var worker = new Worker(url);
<span/>
<span/>worker.onmessage = <span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> (e) {
<span/>    console.log(<span class="hljs-string" style="color: #D69D85; line-height: 26px;">"result: "</span> + e.data);
<span/>}
<span/>worker.postMessage(100);
<span/></code></pre>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">先将嵌入网页的脚本代码，转为一个二进制对象，然后为这个二进制对象生成URL，再让Worker加URL。done</p>
<h3 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; color: black; font-size: 16px; font-weight: bold; text-align: center;"><span class="prefix" style="display: none;"></span><span class="content" style="border-bottom: 2px solid #DEC6FB; color: #595959;">线程同步</span><span class="suffix" style="display: none;"></span></h3>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">最后来说说JavaScript版本的线程同步。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">由于Web Workers是不可以操作DOM的，因为同一个DOM节点只能有一个线程操作，不允许同一个变量或者内存被同时写入。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">如果web Workers可以操作DOM呢？那会怎么样，当然是要用到线程同步的方式限制线程写入。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">同步的意思是协同、互相配合的意思，按照预定的先后次序进行运行。比如说线程A和线程B同步，A执行到一定程度时要依赖B的某个运行结果，那么就必须先停下来，让B运行，B运行完后，把结果给到A，A再继续操作。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">线程同步主要是靠锁来实现的，可以分为以下3种：</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;"><strong style="color: #595959; font-weight: bold;"><span>「</span>互斥锁<span>」</span></strong></p>
<pre class="custom" data-tool="mdnice编辑器" style="margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px;"><span style="display: block; background: url(https://imgkr.cn-bj.ufileos.com/97e4eed2-a992-4976-acf0-ccb6fb34d308.png); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #1E1E1E; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #DCDCDC; display: block; font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; font-size: 12px; -webkit-overflow-scrolling: touch; padding-top: 15px; background: #1E1E1E; border-radius: 5px;">var mutext = new Mutext();
<span/><span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> changeDOM (style) {
<span/>    mutext.lock();
<span/>    document.getElementById(<span class="hljs-string" style="color: #D69D85; line-height: 26px;">'app'</span>).style = style;
<span/>    mutext.unlock();
<span/>}
<span/>
<span/>// worker1
<span/>changeStyle({width: 100px});
<span/>
<span/>// worker2
<span/>changeStyle({width: 150px});
<span/></code></pre>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">在改变某个DOM元素的样式时，先把这部分代码的执行给锁住了，只有执行完了才释放这把锁，其他线程运行到这时也要去申请那把锁，但是由于这把锁没有被释放，所以它就阻塞在那里，只有等到锁被释放了，它才能拿到这把锁再继续加锁。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">互斥锁使用太多会导致性能下降，因为线程阻塞在那里而且还要不断的检测锁能不能用，所以要占用CPU。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;"><strong style="color: #595959; font-weight: bold;"><span>「</span>读写锁<span>」</span></strong></p>
<pre class="custom" data-tool="mdnice编辑器" style="margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px;"><span style="display: block; background: url(https://imgkr.cn-bj.ufileos.com/97e4eed2-a992-4976-acf0-ccb6fb34d308.png); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #1E1E1E; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #DCDCDC; display: block; font-family: Operator Mono, Consolas, Monaco, Menlo, monospace; font-size: 12px; -webkit-overflow-scrolling: touch; padding-top: 15px; background: #1E1E1E; border-radius: 5px;">var rwLock = new ReadWriteLock();
<span/><span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> changeStyle (style) {
<span/>    rwLock.writeLock();
<span/>    document.getElementById(<span class="hljs-string" style="color: #D69D85; line-height: 26px;">'app'</span>).style = style;
<span/>    rwLock.unlock();
<span/>}
<span/>
<span/><span class="hljs-keyword" style="color: #569CD6; line-height: 26px;">function</span> <span class="hljs-function" style="color: #DCDCDC; line-height: 26px;"><span class="hljs-title" style="color: #DCDCDC; line-height: 26px;">getStyle</span></span> () {
<span/>    rwLock.readLock();
<span/>    var style = document.getElementById(<span class="hljs-string" style="color: #D69D85; line-height: 26px;">'app'</span>).style
<span/>    rwLock.unlock();
<span/>    <span class="hljs-built_in" style="color: #4EC9B0; line-height: 26px;">return</span> style;
<span/>}
<span/></code></pre>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">在第二个函数getStyle()获取样式时可以给它加一个读锁，这样其他线程如果想读是可以同时读的，但是不允许有一个线程写入。如果有线程调用了第一个函数，那么调用第二个函数的线程都会被阻塞，因为在写的过程中，不运行被读取。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;"><strong style="color: #595959; font-weight: bold;"><span>「</span>条件变量<span>」</span></strong><br>
条件变量是为解决生产者和消费者的问题，由于互斥锁和读写锁会导致线程一直阻塞而且占用CPU，而使用信号通知的方式可以先让阻塞的线程进入睡眠状态，等生产者生产出东西后通知消费者，再唤醒它进行消费。</p>
<p data-tool="mdnice编辑器" style="padding-top: 8px; padding-bottom: 8px; line-height: 26px; color: #595959; margin: 10px 0px; letter-spacing: 2px; font-size: 14px; word-spacing: 2px;">然而现实上JavaScript是没有线程同步的概念。因为webWorker是无法操作DOM，也没有window对象，每个线程的数据都是独立的。前面说过是通过拷贝复制的方式传递的。所以不存在共享同一块内存区域。</p>
<h2 data-tool="mdnice编辑器" style="margin-top: 30px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 22px; text-align: left; margin: 20px 10px 0px 0px;"><span class="prefix" style="display: none;"></span><span class="content" style="font-size: 18px; font-weight: bold; display: inline-block; padding-left: 10px; border-left: 5px solid #DEC6FB; color: #595959;">结尾</span><span class="suffix"></span></h2>
