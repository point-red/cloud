(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-06fc52fb"],{"208e":function(e,t,r){"use strict";var s=function(){var e=this,t=e._self._c;return t("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales"}},[e._v(" "+e._s(e._f("uppercase")(e.$t("sales")))+" ")])},a=[],i=r("2877"),n={},o=Object(i["a"])(n,s,a,!1,null,null,null);t["a"]=o.exports},"248e":function(e,t,r){},"9fb1":function(e,t,r){"use strict";r.r(t);r("b0c0");var s=function(){var e=this,t=e._self._c;return t("div",[e.deliveryOrder?t("breadcrumb",[t("breadcrumb-sales"),t("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales/delivery-order"}},[e._v(" "+e._s(e._f("uppercase")(e.$t("delivery order")))+" ")]),t("span",{staticClass:"breadcrumb-item active"},[e._v(e._s(e._f("uppercase")(e.deliveryOrder.form.number)))])],1):e._e(),t("sales-menu"),e.deliveryOrder.form.number?t("div",[t("p-show-form-approval-status",{attrs:{form:"sales delivery order","is-loading":e.isLoading,"is-proccess-approval":e.isProccessApproval,"approval-status":e.deliveryOrder.form.approval_status,"approval-reason":e.deliveryOrder.form.approval_reason,"approved-by":e.deliveryOrder.form.request_approval_to.full_name,"cancellation-status":e.deliveryOrder.form.cancellation_status,"close-status":e.deliveryOrder.form.close_status},on:{onApprove:e.onApprove,onReject:e.onReject}}),t("p-show-form-cancellation-status",{attrs:{form:"sales delivery order","is-loading":e.isLoading,"is-proccess-approval":e.isProccessCancellationApproval,"approved-by":e.deliveryOrder.form.request_approval_to.full_name,"cancellation-status":e.deliveryOrder.form.cancellation_status,"close-status":e.deliveryOrder.form.close_status,"cancellation-approval-reason":e.deliveryOrder.form.cancellation_approval_reason,"request-cancellation-reason":e.deliveryOrder.form.request_cancellation_reason},on:{onCancellationApprove:e.onCancellationApprove,onCancellationReject:e.onCancellationReject}}),t("p-show-form-close-status",{attrs:{form:"sales delivery order","is-loading":e.isLoading,"is-proccess-approval":e.isProccessCloseApproval,"approved-by":e.deliveryOrder.form.request_approval_to.full_name,"close-status":e.deliveryOrder.form.close_status,"close-approval-reason":e.deliveryOrder.form.close_approval_reason,"request-close-reason":e.deliveryOrder.form.request_close_reason},on:{onCloseApprove:e.onCloseApprove,onCloseReject:e.onCloseReject}})],1):e._e(),e.deliveryOrder?t("div",{staticClass:"row"},[t("p-block",[t("p-block-inner",{attrs:{"is-loading":e.isLoading}},[t("div",{staticClass:"row"},[t("div",{staticClass:"col-sm-12"},[e.deliveryOrder.form.edited_number?t("h3",[e._v(" "+e._s(e._f("uppercase")(e.$t("archive")))+" ")]):e._e(),e.deliveryOrder.form.number?t("div",{staticClass:"text-right"},[t("button",{staticClass:"mr-3 btn btn-sm btn-outline-secondary mr-5",attrs:{title:"Send Receipt Delivery Order",disabled:e.isSendingEmail},on:{click:function(){return e.$refs.formSendEmail.open()}}},[t("i",{class:{"fa fa-paper-plane":!e.isSendingEmail,"fa fa-asterisk fa-spin":e.isSendingEmail}})]),t("button",{staticClass:"mr-3 btn btn-sm btn-outline-secondary mr-5",attrs:{title:"Preview Receipt Delivery Order"},on:{click:function(){return e.$refs.printPreview.open()}}},[t("i",{staticClass:"si si-printer"})]),t("router-link",{staticClass:"btn btn-sm btn-outline-secondary mr-5",attrs:{to:{name:"sales.delivery-order.create"}}},[e._v(" "+e._s(e._f("uppercase")(e.$t("create")))+" ")]),e.actions.edit?t("router-link",{staticClass:"btn btn-sm btn-outline-secondary mr-5",attrs:{to:{name:"sales.delivery-order.edit",params:{id:e.deliveryOrder.id}}}},[e._v(" "+e._s(e._f("uppercase")(e.$t("edit")))+" ")]):e._e(),e.actions.delete?t("button",{staticClass:"btn btn-sm btn-outline-secondary mr-5",attrs:{disabled:e.isDeleting},on:{click:function(t){return e.$refs.formRequestDelete.open()}}},[t("i",{directives:[{name:"show",rawName:"v-show",value:e.isDeleting,expression:"isDeleting"}],staticClass:"fa fa-asterisk fa-spin"}),e._v(" "+e._s(e._f("uppercase")(e.$t("delete")))+" ")]):e._e(),e.actions.close?t("button",{staticClass:"btn btn-sm btn-outline-secondary mr-5",attrs:{disabled:e.isClosing},on:{click:function(t){return e.$refs.formRequestClose.open()}}},[t("i",{directives:[{name:"show",rawName:"v-show",value:e.isClosing,expression:"isClosing"}],staticClass:"fa fa-asterisk fa-spin"}),e._v(" "+e._s(e._f("uppercase")(e.$t("close")))+" ")]):e._e()],1):e._e()])]),t("hr"),t("div",{staticClass:"row"},[t("div",{staticClass:"col-sm-6"},[t("h4",[e._v(e._s(e._f("uppercase")(e.$t("delivery order"))))]),t("table",{staticClass:"table table-sm table-bordered"},[t("tr",[t("td",{staticClass:"font-weight-bold",attrs:{width:"150px"}},[e._v(" "+e._s(e._f("uppercase")(e.$t("form number")))+" ")]),t("td",[e._v(e._s(e.deliveryOrder.form.number||e.deliveryOrder.form.edited_number))])]),t("tr",[t("td",{staticClass:"font-weight-bold"},[e._v(" "+e._s(e._f("uppercase")(e.$t("date")))+" ")]),t("td",[e._v(e._s(e._f("dateFormat")(e.deliveryOrder.date,"DD MMMM YYYY")))])]),e.deliveryOrder.sales_order?t("tr",[t("td",{staticClass:"font-weight-bold"},[e._v(" "+e._s(e._f("uppercase")(e.$t("reference")))+" ")]),t("td",[e._v(e._s(e.deliveryOrder.sales_order.form.number))])]):e._e(),e.deliveryOrder?t("tr",[t("td",{staticClass:"font-weight-bold"},[e._v(" "+e._s(e._f("uppercase")(e.$t("warehouse")))+" ")]),t("td",[e._v(e._s(e.deliveryOrder.warehouse.name))])]):e._e()])]),t("div",{staticClass:"col-sm-6 text-right"},[t("h6",{staticClass:"mb-5"},[e._v(" "+e._s(e._f("uppercase")(e.authUser.tenant_name))+" ")]),e.deliveryOrder.form.branch?[e._v(" "+e._s(e._f("uppercase")(e.deliveryOrder.form.branch.address))+" "),e.deliveryOrder.form.branch.phone?t("br"):e._e(),e._v(e._s(e._f("uppercase")(e.deliveryOrder.form.branch.phone))+" ")]:e._e(),t("h6",{staticClass:"mt-30 mb-5"},[e._v(" "+e._s(e._f("uppercase")(e.$t("customer")))+" ")]),e._v(" "+e._s(e._f("uppercase")(e.deliveryOrder.customer_name))+" "),t("div",{staticStyle:{"font-size":"12px"}},[e._v(" "+e._s(e._f("uppercase")(e.deliveryOrder.customer_address))+" "),e.deliveryOrder.customer_phone?t("br"):e._e(),e._v(e._s(e.deliveryOrder.customer_phone)+" "),e.deliveryOrder.customer_email?t("br"):e._e(),e._v(e._s(e._f("uppercase")(e.deliveryOrder.customer_email))+" ")])],2)]),t("hr"),t("point-table",{staticClass:"mt-20"},[t("tr",{attrs:{slot:"p-head"},slot:"p-head"},[t("th",{staticClass:"text-center"},[e._v(" # ")]),t("th",[e._v("Item")]),t("th",{staticClass:"text-right"},[e._v(" Quantity Request ")]),t("th",{staticClass:"text-right"},[e._v(" Quantity Delivered ")]),t("th",{staticClass:"text-right"},[e._v(" Quantity Remaining ")])]),e._l(e.deliveryOrder.items,(function(r,s){return[t("tr",{key:s,attrs:{slot:"p-body"},slot:"p-body"},[t("th",{staticClass:"text-center"},[e._v(" "+e._s(s+1)+" ")]),t("td",[e._v(e._s(r.item.label))]),t("td",{staticClass:"text-right"},[e._v(" "+e._s(e._f("numberFormat")(r.quantity_requested))+" "+e._s(r.unit)+" ")]),t("td",{staticClass:"text-right"},[e._v(" "+e._s(e._f("numberFormat")(r.quantity_delivered))+" "+e._s(r.unit)+" ")]),t("td",{staticClass:"text-right"},[e._v(" "+e._s(e._f("numberFormat")(r.quantity_remaining))+" "+e._s(r.unit)+" ")])])]}))],2),t("div",{staticClass:"row mt-50"},[t("div",{staticClass:"col-sm-6"},[t("h6",{staticClass:"mb-0"},[e._v(" "+e._s(e._f("uppercase")(e.$t("notes")))+" ")]),t("div",{staticStyle:{"white-space":"pre-wrap"}},[e._v(" "+e._s(e.deliveryOrder.form.notes)+" ")]),t("div",{staticClass:"d-sm-block d-md-none mt-10"})]),t("div",{staticClass:"col-sm-3 text-center"},[t("h6",{staticClass:"mb-0"},[e._v(" "+e._s(e._f("uppercase")(e.$t("requested by")))+" ")]),t("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[e._v(" "+e._s(e._f("dateFormat")(e.deliveryOrder.form.date,"DD MMMM YYYY"))+" ")]),e._v(" "+e._s(e._f("uppercase")(e.deliveryOrder.form.created_by.full_name))+" "),t("div",{staticClass:"d-sm-block d-md-none mt-10"})]),t("div",{staticClass:"col-sm-3 text-center"},[t("h6",{staticClass:"mb-0"},[e._v(" "+e._s(e._f("uppercase")(e.$t("approved by")))+" ")]),t("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[e.deliveryOrder.form.approval_at?[e._v(" "+e._s(e._f("dateFormat")(e.deliveryOrder.form.approval_at,"DD MMMM YYYY"))+" ")]:[e._v(" _______________ ")]],2),e._v(" "+e._s(e._f("uppercase")(e.deliveryOrder.form.request_approval_to.full_name))+" "),t("div",{staticStyle:{"font-size":"11px"}},[e._v(" "+e._s(e._f("lowercase")(e.deliveryOrder.form.request_approval_to.email))+" ")])])])],1)],1)],1):e._e(),t("m-form-request-delete",{ref:"formRequestDelete",on:{delete:function(t){return e.onDelete(t)}}}),t("m-form-request-close",{ref:"formRequestClose",on:{closeRequest:function(t){return e.onCloseRequest(t)}}}),t("m-form-send-email",{ref:"formSendEmail",on:{submit:function(t){return e.onSendEmail(t)}}}),t("m-print-preview",{ref:"printPreview",attrs:{"delivery-order":e.deliveryOrder}})],1)},a=[],i=r("c7eb"),n=r("1da1"),o=r("5530"),c=(r("d3b7"),r("159b"),r("7db0"),r("14d9"),r("bea4")),l=r("5ae6"),d=r("208e"),u=function(){var e=this,t=e._self._c;return t("sweet-modal",{ref:"print-preview",attrs:{title:e._f("uppercase")(e.$t("print delivery order")),"overlay-theme":"dark"},on:{close:function(t){return e.onClose()}}},[t("table",{staticClass:"print-delivery-order-container m-2 mb-4 mx-auto",attrs:{id:"print-delivery-order"}},[t("thead",[t("tr",[t("td",[t("div",{staticClass:"d-flex justify-content-between",staticStyle:{"margin-bottom":"10px"}},[t("div",{staticStyle:{width:"110px",height:"110px","align-self":"center"}},[t("img",{staticStyle:{width:"100px",height:"100px"},attrs:{src:e.logoUrl,alt:"Logo"}})]),t("div",{staticClass:"company-detail"},[t("h1",{staticStyle:{"margin-top":"0","margin-bottom":"5px"}},[e._v(" Delivery Order ")]),t("h3",{staticClass:"my-5px",staticStyle:{"line-height":"22px"}},[e._v(" "+e._s(e.tenantName)+" ")]),t("p",{staticClass:"my-5px",staticStyle:{"line-height":"15px"}},[e._v(" "+e._s(e.tenantAddress)+" ")]),t("p",{staticClass:"my-5px"},[e._v(" "+e._s(e.tenantPhone)+" ")])])]),t("hr",{staticClass:"header-divider"}),t("div",{staticClass:"d-flex justify-content-between",staticStyle:{"margin-top":"10px","margin-bottom":"10px"}},[t("table",{staticClass:"header-detail",staticStyle:{"margin-right":"20px"}},[t("tr",[t("td",[e._v("Form Number")]),t("td",[e._v(":")]),t("td",[e._v(e._s(e.deliveryOrder.form.number))])]),t("tr",[t("td",[e._v("Date")]),t("td",[e._v(":")]),t("td",[e._v(e._s(e._f("dateFormat")(e.deliveryOrder.date,"DD MMMM YYYY")))])]),t("tr",[t("td",[e._v("Sales Order")]),t("td",[e._v(":")]),t("td",[e._v(e._s("-"))])]),t("tr",[t("td",[e._v("Warehouse")]),t("td",[e._v(":")]),t("td",[e._v(e._s(e.deliveryOrder.warehouse.name||"-"))])])]),t("table",{staticClass:"header-detail",staticStyle:{"margin-left":"20px"}},[t("tr",[t("td",[e._v("Customer")]),t("td",[e._v(":")]),t("td",[e._v(e._s(e.deliveryOrder.customer.name||"-"))])]),t("tr",[t("td",[e._v("Address")]),t("td",[e._v(":")]),t("td",[e._v(e._s(e.deliveryOrder.customer.address||"-"))])]),t("tr",[t("td",[e._v("Phone number")]),t("td",[e._v(":")]),t("td",[e._v(e._s(e.deliveryOrder.customer.phone||"-"))])]),t("tr",[e._v(" . ")])])])])])]),t("tbody",[t("tr",[t("td",[1==e.deliveryOrder.form.cancellation_status?t("div",{staticClass:"watermark"},[t("img",{staticStyle:{opacity:"0.5",width:"100%"},attrs:{src:"/assets/img/draft-watermark.png"}})]):e._e(),t("table",{staticClass:"table-items",staticStyle:{width:"100%"}},[t("thead",[t("tr",[t("th",{staticClass:"text-center"},[e._v(" Item ")]),t("th",{staticClass:"text-center"},[e._v(" Quantity Requested ")]),t("th",{staticClass:"text-center"},[e._v(" Quantity Delivered ")])])]),e._l(e.deliveryOrder.items,(function(r,s){return t("tr",{key:s},[t("td",[e._v(" "+e._s(r.item.label)+" ")]),t("td",{staticClass:"text-center"},[e._v(" "+e._s(e._f("numberFormat")(r.quantity_requested))+" "+e._s(r.unit)+" ")]),t("td",{staticClass:"text-center"},[e._v(" "+e._s(e._f("numberFormat")(r.quantity_delivered))+" "+e._s(r.unit)+" ")])])}))],2),t("div",{staticClass:"d-flex justify-content-end",staticStyle:{"margin-top":"75px"}},[t("div",{staticClass:"text-center",staticStyle:{"margin-right":"75px"}},[t("h3",[e._v("Created By")]),t("br"),t("br"),t("br"),e._v(" "+e._s(e.deliveryOrder.form.created_by.full_name)+" ")]),t("div",{staticClass:"text-center"},[t("h3",[e._v("Approved By")]),t("br"),t("br"),t("br"),e._v(" "+e._s(e.deliveryOrder.form.request_approval_to.full_name)+" ")])])])])])]),t("div",{staticClass:"pull-right"},[t("button",{directives:[{name:"print",rawName:"v-print",value:"print-delivery-order",expression:"'print-delivery-order'"}],staticClass:"btn btn-sm btn-outline-secondary mt-3",attrs:{type:"button"},on:{click:e.createHistoryPrint}},[e._v(" "+e._s(e._f("uppercase")(e.$t("print")))+" ")])])])},v=[],p=(r("3ca3"),r("ddb0"),r("fa1a")),m=r("7b1d"),_=r.n(m),f=r("2f62"),h={directives:{print:_.a},props:{deliveryOrder:{type:Object,required:!0}},data:function(){return{onLoad:!0,logoUrl:"",notes:""}},computed:{tenantName:function(){return localStorage.getItem("tenantName")},tenantAddress:function(){var e=localStorage.getItem("tenantAddress");return e&&"null"!==e||(e="-"),e},tenantPhone:function(){var e=localStorage.getItem("tenantPhone");return e&&"null"!==e||(e="-"),e}},created:function(){var e=this;return Object(n["a"])(Object(i["a"])().mark((function t(){return Object(i["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.onLoad=!0,console.log(e.deliveryOrder),t.next=4,Promise.all([e.getSettingLogo(),e.getSettingEndNote()]);case 4:e.onLoad=!1;case 5:case"end":return t.stop()}}),t)})))()},methods:Object(o["a"])(Object(o["a"])({},Object(f["b"])("salesDeliveryOrderHistory",["add"])),{},{clear:function(){this.mutableId=null,this.mutableLabel=null,this.$emit("choosen",""),this.close()},open:function(){this.$refs["print-preview"].open()},close:function(){this.$refs["select-"+this.id].close()},onClose:function(){this.$emit("close",!0)},createHistoryPrint:function(){var e=this;this.add({id:this.deliveryOrder.id,activity:"Printed"}).catch((function(t){e.$notification.error(t.message),e.form.errors.record(t.errors)}))},getSettingLogo:function(){var e=this;return Object(n["a"])(Object(i["a"])().mark((function t(){var r,s;return Object(i["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,p["a"].get("/setting/logo");case 3:r=t.sent,s=r.data.data,e.logoUrl=s.publicUrl,t.next=11;break;case 8:t.prev=8,t.t0=t["catch"](0),console.log(t.t0);case 11:case"end":return t.stop()}}),t,null,[[0,8]])})))()},getSettingEndNote:function(){var e=this;return Object(n["a"])(Object(i["a"])().mark((function t(){var r,s;return Object(i["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,p["a"].get("/setting/end-note");case 3:r=t.sent,s=r.data.data,e.notes=s.salesInvoice,t.next=11;break;case 8:t.prev=8,t.t0=t["catch"](0),console.log(t.t0);case 11:case"end":return t.stop()}}),t,null,[[0,8]])})))()}})},y=h,b=(r("ec61"),r("2877")),O=Object(b["a"])(y,u,v,!1,null,"28e9d653",null),g=O.exports,C=r("feee"),w={components:{SalesMenu:c["a"],Breadcrumb:l["a"],BreadcrumbSales:d["a"],MPrintPreview:g,PointTable:C["a"]},data:function(){return{isLoading:!1,isProccessApproval:!1,isProccessCancellationApproval:!1,isProccessCloseApproval:!1,isDeleting:!1,isClosing:!1,isSendingEmail:!1}},computed:Object(o["a"])(Object(o["a"])(Object(o["a"])({},Object(f["c"])("salesDeliveryOrder",["deliveryOrder"])),Object(f["c"])("auth",["authUser"])),{},{actions:function(){var e=this.deliveryOrder.form,t=1==e.approval_status,r=0==e.done,s=!!e.number,a=null==e.cancellation_status||1!=e.cancellation_status,i=null==e.close_status||1!=e.close_status;return{edit:r&&i,delete:r&&s&&i&&a,close:r&&s&&i&&t}}}),watch:{$route:function(e,t){e.params.id!=t.params.id&&(this.$route.params.id=e.params.id,this.deliveryOrderRequest())}},created:function(){this.deliveryOrderRequest()},methods:Object(o["a"])(Object(o["a"])({},Object(f["b"])("salesDeliveryOrder",{find:"find",delete:"delete",closeForm:"close",approve:"approve",reject:"reject",cancellationApprove:"cancellationApprove",cancellationReject:"cancellationReject",closeApprove:"closeApprove",closeReject:"closeReject"})),{},{toggleMore:function(){var e=this.deliveryOrder.items.some((function(e,t){return!1===e.more}));this.deliveryOrder.items.forEach((function(t){t.more=e}))},deliveryOrderRequest:function(){var e=this;this.isLoading=!0,this.find({id:this.$route.params.id,params:{with_archives:!0,with_origin:!0,includes:"customer;warehouse;items.item;items.allocation;salesOrder.form;form.createdBy;form.requestApprovalTo;form.branch"}}).then((function(t){e.calculate()})).catch((function(t){e.$notification.error(t.message)})).finally((function(){e.isLoading=!1}))},calculate:function(){var e=0;this.deliveryOrder.items.forEach((function(t){t.discount_percent>0?t.total=t.quantity*(t.price-t.price*t.discount_percent/100):t.discount_value>0?t.total=t.quantity*(t.price-t.discount_value):t.total=t.quantity*t.price,e+=parseFloat(t.total)})),this.deliveryOrder.subtotal=e},onDelete:function(e){var t=this;this.isDeleting=!0,this.delete({id:this.$route.params.id,data:{reason:e}}).then((function(e){t.$notification.success("cancel success"),t.deliveryOrderRequest()})).catch((function(e){t.$notification.error(e.message),t.form.errors.record(e.errors)})).finally((function(){t.isDeleting=!1}))},onCloseRequest:function(e){var t=this;this.isClosing=!0,this.closeForm({id:this.$route.params.id,reason:e}).then((function(e){t.$notification.success("close success"),t.deliveryOrderRequest()})).catch((function(e){t.$notification.error(e.message),t.form.errors.record(e.errors)})).finally((function(){t.isClosing=!1}))},onSendEmail:function(e){var t=this;return Object(n["a"])(Object(i["a"])().mark((function r(){var s;return Object(i["a"])().wrap((function(r){while(1)switch(r.prev=r.next){case 0:return t.isSendingEmail=!0,r.prev=1,s=Object(o["a"])(Object(o["a"])({},e),{},{subject:"Delivery Order Receipt",attachments:[{filename:"Delivery Order Receipt "+t.deliveryOrder.form.number+".pdf",type:"pdf",view:"sales.delivery-order.delivery-order-receipt",view_data:{deliveryOrder:t.deliveryOrder}}]}),r.next=5,t.$store.dispatch("emailService/send",Object(o["a"])({},s));case 5:t.$notification.success("send receipt success"),r.next=12;break;case 8:r.prev=8,r.t0=r["catch"](1),t.$notification.error(r.t0.message),t.form.errors.record(r.t0.errors);case 12:return r.prev=12,t.isSendingEmail=!1,r.finish(12);case 15:case"end":return r.stop()}}),r,null,[[1,8,12,15]])})))()},onApprove:function(){var e=this;this.isProccessApproval=!0,this.approve({id:this.$route.params.id}).then((function(t){e.$notification.success("approve success"),e.deliveryOrderRequest()})).catch((function(t){e.$notification.error(null===t||void 0===t?void 0:t.message)})).finally((function(){e.isProccessApproval=!1}))},onReject:function(e){var t=this;this.isProccessApproval=!0,this.reject({id:this.$route.params.id,reason:e}).then((function(e){t.$notification.success("reject success"),t.deliveryOrderRequest()})).catch((function(e){t.$notification.error(null===e||void 0===e?void 0:e.message)})).finally((function(){t.isProccessApproval=!1}))},onCancellationApprove:function(){var e=this;this.isProccessCancellationApproval=!0,this.cancellationApprove({id:this.$route.params.id}).then((function(t){e.$notification.success("cancellation approved"),e.$router.push("/sales/delivery-order")})).catch((function(t){e.$notification.error(null===t||void 0===t?void 0:t.message)})).finally((function(){e.isProccessCancellationApproval=!1}))},onCancellationReject:function(e){var t=this;this.isProccessCancellationApproval=!0,this.cancellationReject({id:this.$route.params.id,reason:e}).then((function(e){t.$notification.success("cancellation rejected"),t.deliveryOrderRequest()})).catch((function(e){t.$notification.error(null===e||void 0===e?void 0:e.message)})).finally((function(){t.isProccessCancellationApproval=!1}))},onCloseApprove:function(){var e=this;this.isProccessCloseApproval=!0,this.closeApprove({id:this.$route.params.id}).then((function(t){e.$notification.success("close approved"),e.$router.push("/sales/delivery-order")})).catch((function(t){e.$notification.error(null===t||void 0===t?void 0:t.message)})).finally((function(){e.isProccessCloseApproval=!1}))},onCloseReject:function(e){var t=this;this.isProccessCloseApproval=!0,this.closeReject({id:this.$route.params.id,reason:e}).then((function(e){t.$notification.success("close rejected"),t.deliveryOrderRequest()})).catch((function(e){t.$notification.error(null===e||void 0===e?void 0:e.message)})).finally((function(){t.isProccessCloseApproval=!1}))}})},x=w,$=Object(b["a"])(x,s,a,!1,null,null,null);t["default"]=$.exports},ec61:function(e,t,r){"use strict";r("248e")}}]);
//# sourceMappingURL=chunk-06fc52fb.31a7b0ee.js.map