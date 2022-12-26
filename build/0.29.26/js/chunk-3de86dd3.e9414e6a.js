(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3de86dd3"],{"208e":function(t,e,a){"use strict";var s=function(){var t=this,e=t._self._c;return e("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("sales")))+" ")])},r=[],i=a("2877"),o={},n=Object(i["a"])(o,s,r,!1,null,null,null);e["a"]=n.exports},6248:function(t,e,a){"use strict";a.r(e);a("b0c0");var s=function(){var t=this,e=t._self._c;return e("div",[e("breadcrumb",[e("breadcrumb-sales"),e("span",{staticClass:"breadcrumb-item active"},[t._v(t._s(t._f("uppercase")(t.$t("delivery order"))))])],1),e("sales-menu"),e("div",{staticClass:"row"},[e("p-block",[e("div",{staticClass:"input-group block"},[e("div",{staticClass:"input-group-prepend",style:{opacity:t.isExportingData?.3:1,cursor:t.isExportingData?"not-allowed":"pointer"},attrs:{disabled:t.isExportingData},on:{click:t.exportData}},[t.isExportingData?e("span",{staticClass:"input-group-text"},[e("i",{staticClass:"fa fa-asterisk fa-spin"})]):e("span",{staticClass:"input-group-text"},[e("i",{staticClass:"fa fa-download"})])]),t.$permission.has("create sales delivery order")?e("router-link",{staticClass:"input-group-prepend",attrs:{to:"/sales/delivery-order/create"}},[e("span",{staticClass:"input-group-text"},[e("i",{staticClass:"fa fa-plus"})])]):t._e(),e("p-form-input",{ref:"searchText",staticClass:"btn-block",attrs:{id:"search-text",name:"search-text",placeholder:"Search",value:t.searchText},on:{input:t.filterSearch}})],1),e("div",{staticClass:"text-center font-size-sm"},[e("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){t.isAdvanceFilter=!t.isAdvanceFilter}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("advance filter")))+" "),e("i",{staticClass:"fa fa-caret-down"})])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isAdvanceFilter,expression:"isAdvanceFilter"}],staticClass:"card m-5 pt-10",class:{fadeIn:t.isAdvanceFilter}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-3 text-center"},[e("p-form-row",{attrs:{id:"date-start",name:"date-start",label:t.$t("date start"),"is-horizontal":!1}},[e("div",{attrs:{slot:"body"},slot:"body"},[e("p-date-picker",{attrs:{id:"date",name:"date",label:"date"},model:{value:t.date.start,callback:function(e){t.$set(t.date,"start",e)},expression:"date.start"}})],1)])],1),e("div",{staticClass:"col-sm-3 text-center"},[e("p-form-row",{attrs:{id:"date-end",name:"date-end",label:t.$t("date end"),"is-horizontal":!1}},[e("div",{attrs:{slot:"body"},slot:"body"},[e("p-date-picker",{attrs:{id:"date",name:"date",label:"date"},model:{value:t.date.end,callback:function(e){t.$set(t.date,"end",e)},expression:"date.end"}})],1)])],1),e("div",{staticClass:"col-sm-3 text-center"},[e("p-form-row",{attrs:{id:"form-approval-status",name:"form-approval-status",label:t.$t("approval status"),"is-horizontal":!1}},[e("div",{attrs:{slot:"body"},slot:"body"},[e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.formApprovalStatus.open()}}},[t._v(" "+t._s(t._f("uppercase")(t.formApprovalStatus.label||t.$t("select")))+" ")])])])],1),e("div",{staticClass:"col-sm-3 text-center"},[e("p-form-row",{attrs:{id:"form-status",name:"form-status",label:t.$t("form status"),"is-horizontal":!1}},[e("div",{attrs:{slot:"body"},slot:"body"},[e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.formStatus.open()}}},[t._v(" "+t._s(t._f("uppercase")(t.formStatus.label||t.$t("select")))+" ")])])])],1)]),e("hr")]),e("div",{staticStyle:{"margin-top":"10px"}},[t.$permission.has("create sales delivery order")?e("router-link",{staticClass:"input-group-prepend",attrs:{to:"/sales/delivery-order/approval"}},[e("span",{staticClass:"input-group-text font-size-sm"},[t._v(" "+t._s(t._f("uppercase")(t.$t("request approval all")))+" ")])]):t._e()],1),e("hr"),e("p-block-inner",{attrs:{"is-loading":t.isLoading}},[e("point-table",[e("tr",{attrs:{slot:"p-head"},slot:"p-head"},[e("th",[t._v("Number")]),e("th",[t._v("Date")]),e("th",[t._v("Customer")]),e("th",[t._v("Item")]),e("th",[t._v("Warehouse")]),e("th",{staticClass:"text-right"},[t._v(" Quantity ")]),e("th",{staticClass:"text-center"},[t._v(" Approval Status ")]),e("th",{staticClass:"text-center"},[t._v(" Form Status ")]),e("th",{staticClass:"text-center"},[t._v(" History ")]),e("th",{attrs:{width:"50px"}})]),t._l(t.deliveryOrders,(function(a,s){return t._l(a.items,(function(r,i){return e("tr",{key:"pr-"+s+"-i-"+i,attrs:{slot:"p-body"},slot:"p-body"},[e("th",[e("router-link",{attrs:{to:{name:"sales.delivery-order.show",params:{id:a.id}}}},[t._v(" "+t._s(a.form.number)+" ")])],1),e("td",[t._v(t._s(t._f("dateFormat")(a.form.date,"DD MMMM YYYY HH:mm")))]),e("td",[a.customer?[t._v(" "+t._s(a.customer.name)+" ")]:t._e()],2),e("td",[t._v(t._s(r.item.name))]),e("td",[a.warehouse?[t._v(" "+t._s(a.warehouse.name)+" ")]:t._e()],2),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(r.quantity_delivered))+" "+t._s(r.unit)+" ")]),e("td",{staticClass:"text-center"},[0==a.form.last_status?e("div",{staticClass:"badge badge-primary"},[t._v(" "+t._s(t._f("uppercase")(t.$t("pending")))+" ")]):t._e(),-1==a.form.last_status?e("div",{staticClass:"badge badge-danger"},[t._v(" "+t._s(t._f("uppercase")(t.$t("rejected")))+" ")]):t._e(),1==a.form.last_status?e("div",{staticClass:"badge badge-success"},[t._v(" "+t._s(t._f("uppercase")(t.$t("approved")))+" ")]):t._e()]),e("td",{staticClass:"text-center"},[1==a.form.close_status?e("div",{staticClass:"badge badge-danger"},[t._v(" "+t._s(t._f("uppercase")(t.$t("closed")))+" ")]):1==a.form.cancellation_status?e("div",{staticClass:"badge badge-danger"},[t._v(" "+t._s(t._f("uppercase")(t.$t("canceled")))+" ")]):0==a.form.done?e("div",{staticClass:"badge badge-primary"},[t._v(" "+t._s(t._f("uppercase")(t.$t("pending")))+" ")]):1==a.form.done?e("div",{staticClass:"badge badge-success"},[t._v(" "+t._s(t._f("uppercase")(t.$t("done")))+" ")]):t._e()]),e("td",{staticClass:"text-center"},[e("router-link",{staticClass:"btn btn-sm btn-light",attrs:{to:{name:"sales.delivery-order.histories",params:{id:a.id}}}},[e("i",{staticClass:"fa fa-history"})])],1),e("td")])}))}))],2)],1),e("p-pagination",{attrs:{"current-page":t.currentPage,"last-page":t.lastPage},on:{updatePage:t.updatePage}})],1)],1),e("m-form-approval-status",{ref:"formApprovalStatus",on:{choosen:function(e){return t.chooseFormApprovalStatus(e)}}}),e("m-form-status",{ref:"formStatus",on:{choosen:function(e){return t.chooseFormStatus(e)}}})],1)},r=[],i=a("c7eb"),o=a("1da1"),n=a("5530"),l=(a("ac1f"),a("841c"),a("14d9"),a("d3b7"),a("bea4")),c=a("5ae6"),d=a("208e"),u=a("b047"),p=a.n(u),m=a("feee"),f=a("2f62"),v={components:{SalesMenu:l["a"],Breadcrumb:c["a"],BreadcrumbSales:d["a"],PointTable:m["a"]},data:function(){return{isLoading:!0,isExportingData:!1,searchText:this.$route.query.search,currentPage:1*this.$route.query.page||1,lastPage:1,limit:10,isAdvanceFilter:!1,checkedRow:[],formStatus:{id:null,label:null,value:"notArchived"},formApprovalStatus:{id:null,label:null,value:null},date:{start:this.$route.query.date_from?this.$moment(this.$route.query.date_from).format("YYYY-MM-DD 00:00:00"):this.$moment().format("YYYY-MM-01 00:00:00"),end:this.$route.query.date_to?this.$moment(this.$route.query.date_to).format("YYYY-MM-DD 23:59:59"):this.$moment().format("YYYY-MM-DD 23:59:59")}}},computed:Object(n["a"])({},Object(f["c"])("salesDeliveryOrder",["deliveryOrders","pagination"])),watch:{date:{handler:function(){this.$router.push({query:Object(n["a"])(Object(n["a"])({},this.$route.query),{},{date_from:this.date.start,date_to:this.date.end})}),this.getDeliveryOrder()},deep:!0}},created:function(){this.$router.push({query:Object(n["a"])(Object(n["a"])({},this.$route.query),{},{date_from:this.date.start,date_to:this.date.end})}),this.getDeliveryOrder()},updated:function(){this.lastPage=this.pagination.last_page},methods:Object(n["a"])(Object(n["a"])({},Object(f["b"])("salesDeliveryOrder",["get","export"])),{},{chooseFormStatus:function(t){this.formStatus.label=t.label,this.formStatus.value=t.value,this.getDeliveryOrder()},chooseFormApprovalStatus:function(t){this.formApprovalStatus.label=t.label,this.formApprovalStatus.value=t.value,this.getDeliveryOrder()},filterSearch:p()((function(t){this.$router.push({query:Object(n["a"])(Object(n["a"])({},this.$route.query),{},{search:t})}),this.searchText=t,this.currentPage=1,this.getDeliveryOrder()}),300),getDeliveryOrder:function(){var t=this;this.isLoading=!0,this.get({params:{join:"form,customer,items,item",fields:"sales_delivery_order.*",sort_by:"-form.number",group_by:"form.id",filter_form:this.formStatus.value+";"+this.formApprovalStatus.value,filter_like:{"form.number":this.searchText,"customer.name":this.searchText,"item.code":this.searchText,"item.name":this.searchText},filter_date_min:{"form.date":this.serverDateTime(this.date.start,"start")},filter_date_max:{"form.date":this.serverDateTime(this.date.end,"end")},limit:10,includes:"form;customer;warehouse;items.item;items.allocation",page:this.currentPage}}).catch((function(e){t.$notification.error(e.message)})).finally((function(){t.isLoading=!1}))},updatePage:function(t){this.currentPage=t,this.getDeliveryOrder()},exportData:function(){var t=this;return Object(o["a"])(Object(i["a"])().mark((function e(){var a,s;return Object(i["a"])().wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t.isExportingData){e.next=2;break}return e.abrupt("return");case 2:return t.isExportingData=!0,e.prev=3,e.next=6,t.export({params:{join:"form,customer,items,item",fields:"sales_delivery_order.*;sales_delivery_order_item.*",sort_by:"-form.number",filter_form:t.formStatus.value+";"+t.formApprovalStatus.value,filter_like:{"form.number":t.searchText,"customer.name":t.searchText,"item.code":t.searchText,"item.name":t.searchText},filter_date_min:{"form.date":t.serverDateTime(t.date.start,"start")},filter_date_max:{"form.date":t.serverDateTime(t.date.end,"end")},includes:"form;customer;warehouse;items.item"}});case 6:a=e.sent,s=a.data.url,window.open(s,"_blank"),t.isExportingData=!1,e.next=16;break;case 12:e.prev=12,e.t0=e["catch"](3),t.isExportingData=!1,t.$notification.error(e.t0.message);case 16:case"end":return e.stop()}}),e,null,[[3,12]])})))()}})},h=v,_=(a("e859"),a("2877")),b=Object(_["a"])(h,s,r,!1,null,"781b16d2",null);e["default"]=b.exports},"965a":function(t,e,a){},e859:function(t,e,a){"use strict";a("965a")}}]);
//# sourceMappingURL=chunk-3de86dd3.e9414e6a.js.map