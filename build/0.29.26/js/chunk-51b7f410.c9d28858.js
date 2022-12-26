(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-51b7f410"],{"208e":function(e,t,s){"use strict";var r=function(){var e=this,t=e._self._c;return t("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales"}},[e._v(" "+e._s(e._f("uppercase")(e.$t("sales")))+" ")])},a=[],i=s("2877"),o={},c=Object(i["a"])(o,r,a,!1,null,null,null);t["a"]=c.exports},"2a69":function(e,t,s){"use strict";s.r(t);s("caad"),s("b0c0");var r=function(){var e=this,t=e._self._c;return t("div",[t("breadcrumb",[t("breadcrumb-sales"),t("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales/delivery-order"}},[e._v(" "+e._s(e._f("uppercase")(e.$t("delivery order")))+" ")]),t("span",{staticClass:"breadcrumb-item active"},[e._v(e._s(e._f("uppercase")(e.$t("approval"))))])],1),t("sales-menu"),t("div",{staticClass:"row"},[t("p-block",[t("div",{staticClass:"input-group block"},[e.$permission.has("create sales delivery order")?t("router-link",{staticClass:"input-group-prepend",attrs:{to:"/sales/delivery-order/create"}},[t("span",{staticClass:"input-group-text"},[t("i",{staticClass:"fa fa-plus"})])]):e._e(),t("p-form-input",{ref:"searchText",staticClass:"btn-block",attrs:{id:"search-text",name:"search-text",placeholder:"Search",value:e.searchText},on:{input:e.filterSearch}})],1),t("div",{staticClass:"input-group block"},[t("button",{staticClass:"btn btn-primary mr-3",on:{click:e.sendRequest}},[e._v(" Sent "+e._s(e.checkedRow.length)+" "+e._s("Request".concat(e.checkedRow.length>1?"s":""))+" "),t("i",{staticClass:"fa fa-paper-plane"})])]),t("hr"),t("p-block-inner",{attrs:{"is-loading":e.isLoading}},[t("point-table",[t("tr",{attrs:{slot:"p-head"},slot:"p-head"},[t("th",{attrs:{width:"50px"}},[t("p-form-check-box",{staticClass:"text-center",attrs:{id:"subscibe",name:"subscibe","is-form":!1,checked:e.isRowsChecked(e.deliveryOrders,e.checkedRow)},nativeOn:{click:function(t){return e.toggleCheckRows()}}})],1),t("th",[e._v("Number")]),t("th",[e._v("Date")]),t("th",[e._v("Customer")]),t("th",[e._v("Item")]),t("th",[e._v("Warehouse")]),t("th",{staticClass:"text-right"},[e._v(" Quantity ")]),t("th",{staticClass:"text-center"},[e._v(" Approval Status ")]),t("th",[e._v(" Last Request ")])]),e._l(e.deliveryOrders,(function(s,r){return e._l(s.items,(function(a,i){return t("tr",{key:"pr-"+r+"-i-"+i,attrs:{slot:"p-body"},slot:"p-body"},[t("td",[t("p-form-check-box",{staticClass:"text-center",attrs:{id:"subscibe","is-form":!1,name:"subscibe",checked:e.isRowChecked(s.id)},nativeOn:{click:function(t){return e.toggleCheckRow(s.id)}}})],1),t("th",[t("router-link",{attrs:{to:{name:"sales.delivery-order.show",params:{id:s.id}}}},[e._v(" "+e._s(s.form.number+([0,1].includes(s.form.close_status)?" - Closed":""))+" ")])],1),t("td",[e._v(e._s(e._f("dateFormat")(s.form.date,"DD MMMM YYYY HH:mm")))]),t("td",[s.customer?[e._v(" "+e._s(s.customer.name)+" ")]:e._e()],2),t("td",[e._v(e._s(a.item.name))]),t("td",[s.warehouse?[e._v(" "+e._s(s.warehouse.name)+" ")]:e._e()],2),t("td",{staticClass:"text-right"},[e._v(" "+e._s(e._f("numberFormat")(a.quantity_delivered))+" "+e._s(a.unit)+" ")]),t("td",{staticClass:"text-center"},[0==s.form.approval_status?t("div",{staticClass:"badge badge-primary"},[e._v(" "+e._s(e._f("uppercase")(e.$t("pending")))+" ")]):e._e(),-1==s.form.approval_status?t("div",{staticClass:"badge badge-danger"},[e._v(" "+e._s(e._f("uppercase")(e.$t("rejected")))+" ")]):e._e(),1==s.form.approval_status?t("div",{staticClass:"badge badge-success"},[e._v(" "+e._s(e._f("uppercase")(e.$t("approved")))+" ")]):e._e()]),t("td",[s.last_request_date?t("span",[e._v(" "+e._s(e._f("dateFormat")(s.last_request_date,"DD MMMM YYYY HH:mm"))+" ")]):e._e()])])}))}))],2)],1),t("p-pagination",{attrs:{"current-page":e.currentPage,"last-page":e.lastPage},on:{updatePage:e.updatePage}})],1)],1),t("m-form-approval-status",{ref:"formApprovalStatus",on:{choosen:function(t){return e.chooseFormApprovalStatus(t)}}}),t("m-form-status",{ref:"formStatus",on:{choosen:function(t){return e.chooseFormStatus(t)}}})],1)},a=[],i=s("53ca"),o=s("5530"),c=(s("ac1f"),s("841c"),s("14d9"),s("a434"),s("d81d"),s("d3b7"),s("159b"),s("bea4")),n=s("5ae6"),u=s("208e"),d=s("b047"),l=s.n(d),h=s("feee"),f=s("2f62"),m=s("7f45"),p=s.n(m),v={components:{SalesMenu:c["a"],Breadcrumb:n["a"],BreadcrumbSales:u["a"],PointTable:h["a"]},data:function(){return{isLoading:!0,searchText:this.$route.query.search,currentPage:1*this.$route.query.page||1,lastPage:1,limit:10,checkedRow:[],formStatus:{id:null,label:null,value:"notArchived"},formApprovalStatus:{id:null,label:null,value:null},date:{start:this.$route.query.date_from?this.$moment(this.$route.query.date_from).format("YYYY-MM-DD 00:00:00"):this.$moment().format("YYYY-MM-01 00:00:00"),end:this.$route.query.date_to?this.$moment(this.$route.query.date_to).format("YYYY-MM-DD 23:59:59"):this.$moment().format("YYYY-MM-DD 23:59:59")}}},computed:Object(o["a"])({},Object(f["c"])("salesDeliveryOrderApproval",["deliveryOrders","pagination"])),watch:{date:{handler:function(){this.$router.push({query:Object(o["a"])(Object(o["a"])({},this.$route.query),{},{date_from:this.date.start,date_to:this.date.end})}),this.getDeliveryOrders()},deep:!0}},created:function(){this.$router.push({query:Object(o["a"])(Object(o["a"])({},this.$route.query),{},{date_from:this.date.start,date_to:this.date.end})}),this.getDeliveryOrders()},updated:function(){this.lastPage=this.pagination.last_page},methods:Object(o["a"])(Object(o["a"])({},Object(f["b"])("salesDeliveryOrderApproval",["get","send"])),{},{toggleCheckRow:function(e){this.isRowChecked(e)?this.checkedRow.splice(this.checkedRow.map((function(e){return e.id})).indexOf(e),1):this.checkedRow.push({id:e})},toggleCheckRows:function(){var e=this;this.isRowsChecked(this.deliveryOrders,this.checkedRow)?this.deliveryOrders.forEach((function(t){e.checkedRow.splice(e.checkedRow.map((function(e){return e.id})).indexOf(t.id),1)})):this.deliveryOrders.forEach((function(t){if(!e.isRowChecked(t.id)){var s=t.id;e.checkedRow.push({id:s})}}))},isRowChecked:function(e){return this.checkedRow.some((function(t){return t.id==e}))},isRowsChecked:function(e,t){if(0==t.length)return!1;for(var s=function(s){var r=t.some((function(t){return t.id==e[s].id}));if(!r)return{v:!1}},r=0;r<e.length;r++){var a=s(r);if("object"===Object(i["a"])(a))return a.v}return!0},bulkApprove:function(){var e=this;this.bulkApprove({deliveryOrders:this.checkedRow}).then((function(t){e.checkedRow=[],e.getDeliveryOrders()}))},chooseFormStatus:function(e){this.formStatus.label=e.label,this.formStatus.value=e.value,this.getDeliveryOrders()},chooseFormApprovalStatus:function(e){this.formApprovalStatus.label=e.label,this.formApprovalStatus.value=e.value,this.getDeliveryOrders()},filterSearch:l()((function(e){this.$router.push({query:Object(o["a"])(Object(o["a"])({},this.$route.query),{},{search:e})}),this.searchText=e,this.currentPage=1,this.getDeliveryOrders()}),300),getDeliveryOrders:function(){var e=this;this.isLoading=!0,this.get({params:{join:"form,customer,items,item",fields:"sales_delivery_order.*",sort_by:"-form.number",group_by:"form.id",filter_form:this.formStatus.value+";"+this.formApprovalStatus.value,filter_like:{"form.number":this.searchText,"customer.name":this.searchText,"item.code":this.searchText,"item.name":this.searchText},filter_date_min:{"form.date":this.serverDateTime(this.date.start,"start")},filter_date_max:{"form.date":this.serverDateTime(this.date.end,"end")},limit:10,includes:"form;customer;warehouse;items.item;items.allocation",page:this.currentPage}}).catch((function(t){e.$notification.error(t.message)})).finally((function(){e.deliveryOrders.forEach((function(e){if(null!=e.last_request_date){var t=p.a.utc(e.last_request_date).toDate(),s=p()(t).local().format("YYYY-MM-DD HH:mm:ss");e.last_request_date=s}})),e.isLoading=!1}))},updatePage:function(e){this.currentPage=e,this.getDeliveryOrders()},sendRequest:function(){var e=this;this.checkedRow.length>0&&(this.isLoading=!0,this.send({ids:this.checkedRow}).then((function(t){e.$notification.success("sending email approval success"),e.checkedRow=[],e.getDeliveryOrders()})).catch((function(t){e.$notification.error(t.message)})).finally((function(){e.isLoading=!1})))}})},_=v,b=s("2877"),g=Object(b["a"])(_,r,a,!1,null,"11258b73",null);t["default"]=g.exports}}]);
//# sourceMappingURL=chunk-51b7f410.c9d28858.js.map