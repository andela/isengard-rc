!function(){function Inline(defaults,form){this.iframeLoaded=!1,this.iframeOpen=!1,this.defaults=defaults,this.isEmbed=null!=defaults.container,this.loadButtonCSS(),this.setupIframe(),noBrowserIframeSupport()&&(this.fallback=!0),form&&(this.form=form,this.createButton()),this.listenForCloseEvent()}function randomId(){for(var text="",possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",i=0;5>i;i++)text+=possible.charAt(Math.floor(Math.random()*possible.length));return text}function isValid(defaults){if(validateInputTypes(defaults),void 0==defaults.key)throw new Error("Please provide your public key via the key attribute");if(void 0==defaults.amount&&void 0==defaults.plan)throw new Error("Please provide transaction amount via the amount or plan attribute");if(void 0==defaults.email&&void 0==defaults.customer_code)throw new Error("Please provide customer email via the email or customerCode attribute");if(defaults.transaction_charge&&defaults.transaction_charge>=defaults.amount)throw new Error("Transaction charge must be less than the transaction amount");if(defaults.bearer&&"account"!=defaults.bearer&&"subaccount"!=defaults.bearer)throw new Error("Bearer should be either account or subaccount");var buttonNotFound=defaults.customButton&&void 0!=defaults.customButton&&void 0==document.getElementById(defaults.customButton);if(buttonNotFound)throw new Error("Please ensure a button with id "+defaults.customButton+" is defined");var containerNotFound=defaults.container&&void 0!=defaults.container&&void 0==document.getElementById(defaults.container);if(containerNotFound)throw new Error("Please ensure an element with id "+defaults.container+" is defined");return!0}function validateInputTypes(defaults){function validate(key,value){if(validation[key]&&value)switch(validation[key]){case"email":isValidEmail(value)||throwInvalid(key);break;case"integer":isNormalInteger(value)||throwInvalid(key);break;case"function":isFunction(value)||throwInvalid(key);break;case"object":isObject(value)||throwInvalid(key)}}function throwInvalid(key){throw new Error("Attribute "+key+" must be a valid "+validation[key])}var validation={email:"email",amount:"integer",transaction_charge:"integer",onClose:"function",callback:"function",metadata:"object"};for(var key in defaults){var value=defaults[key];validate(key,value)}}function checkForParentForm(script){if("FORM"==script.parentElement.tagName)return!0;throw new Error("Please put your Paystack Inline javascript file inside of a form element")}function getParentForm(script){return form=script.parentElement}function hasDataAttribute(script){var result=!1,list=script.attributes;list=Array.prototype.slice.call(list);for(key in list){var element=list[key].nodeName;element.indexOf("data")>-1&&(result=!0)}return result}function noBrowserIframeSupport(){var testIframe=document.createElement("iframe"),browserSupportsIframe="onload"in testIframe;return browserSupportsIframe||console.warn("This browser does not support iframes. Please redirect to standard"),!browserSupportsIframe}function parseResponse(message,defaults){var action,split,iframeId,data,isThisIframe;return"string"==typeof message&&(action=message.split(" ")[0]),action&&(split=message.split(" "),iframeId=split[1],data=split[2],isThisIframe=defaults.id==iframeId),{action:action,isThisIframe:isThisIframe,data:data}}function omitKeys(object,keys){for(var _object=JSON.parse(JSON.stringify(object)),i=0;i<keys.length;i++)delete _object[keys[i]];for(var key in _object)_object.hasOwnProperty(key)&&!_object[key]&&delete _object[key];return _object}function serialize(obj){return Object.keys(obj).map(function(k){return encodeURIComponent(k)+"="+encodeURIComponent(obj[k])}).join("&")}function isObject(obj){return obj===Object(obj)&&"[object Array]"!==Object.prototype.toString.call(obj)}function isNormalInteger(number){var int=parseInt(number);return int==number&&number>=0}function isFunction(functionToCheck){if(!functionToCheck)return!1;var getType={};return functionToCheck&&"[object Function]"===getType.toString.call(functionToCheck)}function isValidEmail(email){var re=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return re.test(email)}function getHref(){var href=window.location.href;return href&&href.length>500&&(href=href.split("?")[0]),href}function cssLoad(url,callback){function resolve(){resolved=!0;for(var i=0,len=resolutions.length;len>i;i++)resolutions[i]()}function reject(){rejected=!0;for(var i=0,len=rejections.length;len>i;i++)rejections[i]()}var promise,count,id,urlString,resolutions=[],rejections=[],resolved=!1,rejected=!1;this.count=this.count?++this.count:1,count=this.count,urlString=url.split("/"),id="load-css-"+urlString[urlString.length-1],promise={done:function(callback){return resolutions.push(callback),resolved&&callback(),promise},fail:function(callback){return rejections.push(callback),rejected&&callback(),promise}};var link=document.createElement("link");return link.setAttribute("id",id),link.setAttribute("rel","stylesheet"),link.setAttribute("type","text/css"),"undefined"!=typeof link.addEventListener?(link.addEventListener("load",resolve,!1),link.addEventListener("error",reject,!1)):"undefined"!=typeof link.attachEvent&&link.attachEvent("onload",function(){var txt,cur,i=document.styleSheets.length;try{for(;i--;)if(cur=document.styleSheets[i],cur.id===id)return txt=cur.cssText,void resolve()}catch(e){}resolved||reject()}),PaystackPop.loadedScripts=PaystackPop.loadedScripts||{},void 0==PaystackPop.loadedScripts[id]?(PaystackPop.loadedScripts[id]=!0,document.getElementsByTagName("head")[0].appendChild(link),link.setAttribute("href",url),promise):!0}var eventMethod=window.addEventListener?"addEventListener":"attachEvent",eventer=window[eventMethod],messageEvent="attachEvent"==eventMethod?"onmessage":"message",config={inlineBaseUrl:"https://paystack.com/"};Inline.prototype.loadButtonCSS=function(){var buttonPath=config.inlineBaseUrl+"assets/payment/css/button.min.css?ver=1";cssLoad(buttonPath)},Inline.prototype.setupIframe=function(){var instance=this;instance.defaults.metadata.referrer=getHref(),instance.defaults.metadata=JSON.stringify(instance.defaults.metadata);var htmlPath=config.inlineBaseUrl+"templates/payment/inline.html",params=omitKeys(instance.defaults,["customButton","onClose","callback","tlsFallback"]);params.hasTLSFallback=null!==instance.defaults.tlsFallback;var source=htmlPath+"?"+serialize(params);instance.isEmbed?instance.setupEmbed(source):instance.setupPopup(source)},Inline.prototype.setupPopup=function(source){var cssText="z-index: 9999;\ndisplay: none;\nbackground: transparent;\nbackground: rgba(0,0,0,0.005);\nborder: 0px none transparent;\noverflow-x: hidden;\noverflow-y: hidden;\nvisibility: hidden;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none; position: fixed;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;";this.appendIframe({src:source,cssText:cssText,className:"paystack_pop",parent:document.body})},Inline.prototype.setupEmbed=function(source){var cssText="background: transparent;\nbackground: rgba(0,0,0,0);\nborder: 0px none transparent;\noverflow-x: hidden;\noverflow-y: hidden;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;",container=document.getElementById(this.defaults.container);container.removeAttribute("style"),container.className="paystack-embed-container",container.style.position="relative",container.style.width="100%",this.listenForResizeEvent(),this.appendIframe({src:source,cssText:cssText,className:"paystack_embed",parent:container}),this.openIframe()},Inline.prototype.appendIframe=function(options){var instance=this;iframe=document.createElement("iframe"),iframe.setAttribute("frameBorder","0"),iframe.setAttribute("allowtransparency","true"),iframe.style.cssText=options.cssText,iframe.id=iframe.name=instance.defaults.id,iframe.src=options.src,iframe.className=options.className,options.parent.appendChild(iframe),iframe.onload=function(){instance.iframeLoaded=!0}},Inline.prototype.createButton=function(){var button,instance=this;instance.defaults.customButton?(button=document.getElementById(instance.defaults.customButton),button.setAttribute("data-paystack",instance.defaults.id)):(button=document.createElement("button"),button.innerHTML="<span class='paystack-top-blue'>Pay Securely with Paystack</span><span class='paystack-body-image'> </span>",button.setAttribute("class","paystack-trigger-btn"),button.setAttribute("data-paystack",instance.defaults.id),sourceScript.parentNode.insertBefore(button,sourceScript.nextSibling)),button.addEventListener("click",function(e){e.preventDefault(),instance.openIframe()},!1)},Inline.prototype.listenForCloseEvent=function(){var instance=this;eventer(messageEvent,function(e){var data=e.data||e.message;if(data&&("string"==typeof data||data instanceof String)){var response=parseResponse(data,instance.defaults);if(!response.isThisIframe)return;if("PaystackClose"==response.action){var reference=response.data;reference?instance.handleSuccess(reference):instance.defaults.onClose&&instance.callCloseCallback(),instance.isEmbed||instance.closeIframe()}"PaystackTLSClose"==response.action&&(instance.defaults.tlsFallback.call(this),instance.isEmbed||instance.closeIframe())}},!1)},Inline.prototype.listenForResizeEvent=function(){var instance=this;eventer(messageEvent,function(e){var data=e.data||e.message;if(data&&("string"==typeof data||data instanceof String)){var response=parseResponse(data,instance.defaults);if(!response.isThisIframe||"PaystackResize"!=response.action)return;var container=document.getElementById(instance.defaults.container);container.style.height=response.data+"px"}},!1)},Inline.prototype.openIframe=function(){var instance=this;if(!this.iframeOpen){var open=function(){var iframe=document.getElementById(instance.defaults.id),receiver=iframe.contentWindow;receiver.postMessage("PaystackOpen "+instance.defaults.id,"*"),instance.isEmbed||(iframe.style.display="block",iframe.style.visibility="visible",document.body.style.overflow="hidden"),instance.iframeOpen=!0};instance.iframeLoaded?open():iframe.onload=function(){open(),instance.iframeLoaded=!0}}},Inline.prototype.closeIframe=function(){if(this.iframeOpen&&!this.isEmbed){var iframe=document.getElementById(this.defaults.id);iframe.style.display="none",iframe.style.visibility="hidden",this.iframeOpen=!1,document.body.style.overflow=""}},Inline.prototype.handleSuccess=function(reference){if(this.defaults.callback||this.form){if(this.form){var input=document.createElement("input");input.type="hidden",input.value=reference,input.name="reference",this.form.appendChild(input);var input=document.createElement("input");return input.type="hidden",input.value=reference,input.name="paystack-trxref",this.form.appendChild(input),void this.form.submit()}if(this.defaults.callback){var response={reference:reference,trxref:reference};this.defaults.callback.call(this,response)}}},Inline.prototype.callCloseCallback=function(){this.defaults.onClose&&this.defaults.onClose.call(this)};var PaystackPop=function(){return{setup:function(options,script){var handler="paystack"+randomId(),defaults={id:handler,key:options.key||"",ref:options.ref||"",bank:options.bank||"",label:options.label||"",email:options.email||"",amount:options.amount||"",currency:options.currency||"NGN",container:options.container,customButton:options.custom_button||options.customButton||"",firstname:options.firstname||"",lastname:options.lastname||"",phone:options.phone||"",remark:options.remark||"",payment_page:options.payment_page||options.paymentPage||"",plan:options.plan||"",quantity:options.quantity||"",coupon:options.coupon||"",customer_code:options.customer_code||options.customerCode||"",subaccount:options.subaccount||"",transaction_charge:options.transaction_charge||options.transactionCharge||"",bearer:options.bearer||"",metadata:options.metadata||{},onClose:options.on_close||options.onClose||"",callback:options.callback||"",tlsFallback:options.tlsFallback||""};return isValid(defaults)?script?(checkForParentForm(script),void(window[handler]=new Inline(defaults,getParentForm(script)))):new Inline(defaults,!1):void 0}}}();window.PaystackPop=PaystackPop;var sourceScript=document.currentScript||function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();hasDataAttribute(sourceScript)&&PaystackPop.setup({key:sourceScript.getAttribute("data-key"),ref:sourceScript.getAttribute("data-ref"),bank:sourceScript.getAttribute("data-bank"),email:sourceScript.getAttribute("data-label"),email:sourceScript.getAttribute("data-email"),amount:sourceScript.getAttribute("data-amount"),currency:sourceScript.getAttribute("data-currency"),container:sourceScript.getAttribute("data-container"),customButton:sourceScript.getAttribute("data-custom-button"),firstname:sourceScript.getAttribute("data-firstname"),lastname:sourceScript.getAttribute("data-lastname"),phone:sourceScript.getAttribute("data-phone"),remark:sourceScript.getAttribute("data-remark"),payment_page:sourceScript.getAttribute("data-payment-page"),plan:sourceScript.getAttribute("data-plan"),quantity:sourceScript.getAttribute("data-quantity"),coupon:sourceScript.getAttribute("data-coupon"),customer_code:sourceScript.getAttribute("data-customer-code"),subaccount:sourceScript.getAttribute("data-subaccount"),transaction_charge:sourceScript.getAttribute("data-transaction-charge"),bearer:sourceScript.getAttribute("data-bearer"),metadata:sourceScript.getAttribute("data-metadata"),onClose:sourceScript.getAttribute("data-on-close"),callback:sourceScript.getAttribute("data-callback"),tlsFallback:sourceScript.getAttribute("data-tls-callback")},sourceScript)}();