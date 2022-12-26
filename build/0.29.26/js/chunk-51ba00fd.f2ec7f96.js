(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-51ba00fd"],{"208e":function(t,e,a){"use strict";var s=function(){var t=this,e=t._self._c;return e("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("sales")))+" ")])},r=[],i=a("2877"),o={},n=Object(i["a"])(o,s,r,!1,null,null,null);e["a"]=n.exports},8315:function(t,e,a){"use strict";a.r(e);a("b0c0");var s=function(){var t=this,e=t._self._c;return e("div",[e("breadcrumb",[e("breadcrumb-sales"),e("span",{staticClass:"breadcrumb-item active"},[t._v(t._s(t._f("uppercase")(t.$t("sales quotation"))))])],1),e("sales-menu"),e("div",{staticClass:"row"},[e("p-block",[e("div",{staticClass:"input-group block"},[t.$permission.has("create sales quotation")?e("router-link",{staticClass:"input-group-prepend",attrs:{to:"/sales/quotation/create"}},[e("span",{staticClass:"input-group-text"},[e("i",{staticClass:"fa fa-plus"})])]):t._e(),e("p-form-input",{ref:"searchText",staticClass:"btn-block",attrs:{id:"search-text",name:"search-text",placeholder:"Search",value:t.searchText},on:{input:t.filterSearch}})],1),e("div",{staticClass:"text-center font-size-sm"},[e("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){t.isAdvanceFilter=!t.isAdvanceFilter}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("advance filter")))+" "),e("i",{staticClass:"fa fa-caret-down"})])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isAdvanceFilter,expression:"isAdvanceFilter"}],staticClass:"card m-5 pt-10",class:{fadeIn:t.isAdvanceFilter}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-3 text-center"},[e("p-form-row",{attrs:{id:"date-start",name:"date-start",label:t.$t("date start"),"is-horizontal":!1}},[e("div",{attrs:{slot:"body"},slot:"body"},[e("p-date-picker",{attrs:{id:"date",name:"date",label:"date"},model:{value:t.date.start,callback:function(e){t.$set(t.date,"start",e)},expression:"date.start"}})],1)])],1),e("div",{staticClass:"col-sm-3 text-center"},[e("p-form-row",{attrs:{id:"date-end",name:"date-end",label:t.$t("date end"),"is-horizontal":!1}},[e("div",{attrs:{slot:"body"},slot:"body"},[e("p-date-picker",{attrs:{id:"date",name:"date",label:"date"},model:{value:t.date.end,callback:function(e){t.$set(t.date,"end",e)},expression:"date.end"}})],1)])],1),e("div",{staticClass:"col-sm-3 text-center"},[e("p-form-row",{attrs:{id:"form-approval-status",name:"form-approval-status",label:t.$t("approval status"),"is-horizontal":!1}},[e("div",{attrs:{slot:"body"},slot:"body"},[e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.formApprovalStatus.open()}}},[t._v(" "+t._s(t._f("uppercase")(t.formApprovalStatus.label||t.$t("select")))+" ")])])])],1),e("div",{staticClass:"col-sm-3 text-center"},[e("p-form-row",{attrs:{id:"form-status",name:"form-status",label:t.$t("form status"),"is-horizontal":!1}},[e("div",{attrs:{slot:"body"},slot:"body"},[e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.formStatus.open()}}},[t._v(" "+t._s(t._f("uppercase")(t.formStatus.label||t.$t("select")))+" ")])])])],1)]),e("hr")]),e("div",{staticClass:"mt-10"},[e("span",{directives:[{name:"show",rawName:"v-show",value:t.checkedRow.length>0,expression:"checkedRow.length > 0"}],staticClass:"mr-15 animated fadeIn"})]),e("hr"),e("p-block-inner",{attrs:{"is-loading":t.isLoading}},[e("point-table",[e("tr",{attrs:{slot:"p-head"},slot:"p-head"},[e("th",[t._v("Number")]),e("th",[t._v("Date")]),e("th",[t._v("Customer")]),e("th",[t._v("Item")]),e("th",{staticClass:"text-right"},[t._v(" Quantity ")]),e("th",{staticClass:"text-right"},[t._v(" Price ")]),e("th",{staticClass:"text-right"},[t._v(" Value ")]),e("th",{staticClass:"text-center"},[t._v(" Approval Status ")]),e("th",{staticClass:"text-center"},[t._v(" Form Status ")]),e("th",{attrs:{width:"50px"}})]),t._l(t.salesQuotations,(function(a,s){return t._l(a.items,(function(r,i){return e("tr",{key:"pr-"+s+"-i-"+i,attrs:{slot:"p-body"},slot:"p-body"},[e("th",[e("router-link",{attrs:{to:{name:"sales.quotation.show",params:{id:a.id}}}},[t._v(" "+t._s(a.form.number)+" ")])],1),e("td",[t._v(t._s(t._f("dateFormat")(a.form.date,"DD MMMM YYYY HH:mm")))]),e("td",[a.customer?[t._v(" "+t._s(a.customer.name)+" ")]:t._e()],2),e("td",[t._v(t._s(r.item.name))]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(r.quantity))+" "+t._s(r.unit)+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(r.price))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(r.quantity*r.price))+" ")]),e("td",{staticClass:"text-center"},[0==a.form.approval_status?e("div",{staticClass:"badge badge-primary"},[t._v(" "+t._s(t._f("uppercase")(t.$t("pending")))+" ")]):t._e(),-1==a.form.approval_status?e("div",{staticClass:"badge badge-danger"},[t._v(" "+t._s(t._f("uppercase")(t.$t("rejected")))+" ")]):t._e(),1==a.form.approval_status?e("div",{staticClass:"badge badge-success"},[t._v(" "+t._s(t._f("uppercase")(t.$t("approved")))+" ")]):t._e()]),e("td",{staticClass:"text-center"},[1==a.form.cancellation_status?e("div",{staticClass:"badge badge-danger"},[t._v(" "+t._s(t._f("uppercase")(t.$t("canceled")))+" ")]):0==a.form.done?e("div",{staticClass:"badge badge-primary"},[t._v(" "+t._s(t._f("uppercase")(t.$t("pending")))+" ")]):1==a.form.done?e("div",{staticClass:"badge badge-success"},[t._v(" "+t._s(t._f("uppercase")(t.$t("done")))+" ")]):t._e()]),e("td")])}))}))],2)],1),e("p-pagination",{attrs:{"current-page":t.currentPage,"last-page":t.lastPage},on:{updatePage:t.updatePage}})],1)],1),e("m-form-approval-status",{ref:"formApprovalStatus",on:{choosen:function(e){return t.chooseFormApprovalStatus(e)}}}),e("m-form-status",{ref:"formStatus",on:{choosen:function(e){return t.chooseFormStatus(e)}}})],1)},r=[],i=a("53ca"),o=a("5530"),n=(a("ac1f"),a("841c"),a("14d9"),a("a434"),a("d81d"),a("d3b7"),a("159b"),a("bea4")),c=a("5ae6"),l=a("208e"),u=a("b047"),d=a.n(u),h=a("feee"),m=a("2f62"),p={components:{SalesMenu:n["a"],Breadcrumb:c["a"],BreadcrumbSales:l["a"],PointTable:h["a"]},data:function(){return{isLoading:!0,searchText:this.$route.query.search,currentPage:1*this.$route.query.page||1,lastPage:1,limit:10,isAdvanceFilter:!1,checkedRow:[],formStatus:{id:null,label:null,value:"notArchived"},formApprovalStatus:{id:null,label:null,value:null},date:{start:this.$route.query.date_from?this.$moment(this.$route.query.date_from).format("YYYY-MM-DD 00:00:00"):this.$moment().format("YYYY-MM-01 00:00:00"),end:this.$route.query.date_to?this.$moment(this.$route.query.date_to).format("YYYY-MM-DD 23:59:59"):this.$moment().format("YYYY-MM-DD 23:59:59")}}},computed:Object(o["a"])({},Object(m["c"])("salesQuotation",["salesQuotations","pagination"])),watch:{date:{handler:function(){this.$router.push({query:Object(o["a"])(Object(o["a"])({},this.$route.query),{},{date_from:this.date.start,date_to:this.date.end})}),this.getSalesOrder()},deep:!0}},created:function(){this.$router.push({query:Object(o["a"])(Object(o["a"])({},this.$route.query),{},{date_from:this.date.start,date_to:this.date.end})}),this.getSalesOrder()},updated:function(){this.lastPage=this.pagination.last_page},methods:Object(o["a"])(Object(o["a"])({},Object(m["b"])("salesQuotation",["get"])),{},{toggleCheckRow:function(t){this.isRowChecked(t)?this.checkedRow.splice(this.checkedRow.map((function(t){return t.id})).indexOf(t),1):this.checkedRow.push({id:t})},toggleCheckRows:function(){var t=this;this.isRowsChecked(this.salesQuotations,this.checkedRow)?this.salesQuotations.forEach((function(e){t.checkedRow.splice(t.checkedRow.map((function(t){return t.id})).indexOf(e.id),1)})):this.salesQuotations.forEach((function(e){if(!t.isRowChecked(e.id)){var a=e.id;t.checkedRow.push({id:a})}}))},isRowChecked:function(t){return this.checkedRow.some((function(e){return e.id==t}))},isRowsChecked:function(t,e){if(0==e.length)return!1;for(var a=function(a){var s=e.some((function(e){return e.id==t[a].id}));if(!s)return{v:!1}},s=0;s<t.length;s++){var r=a(s);if("object"===Object(i["a"])(r))return r.v}return!0},bulkApprove:function(){var t=this;this.bulkApprove({salesQuotations:this.checkedRow}).then((function(e){t.checkedRow=[],t.getSalesOrder()}))},chooseFormStatus:function(t){this.formStatus.label=t.label,this.formStatus.value=t.value,this.getSalesOrder()},chooseFormApprovalStatus:function(t){this.formApprovalStatus.label=t.label,this.formApprovalStatus.value=t.value,this.getSalesOrder()},filterSearch:d()((function(t){this.$router.push({query:Object(o["a"])(Object(o["a"])({},this.$route.query),{},{search:t})}),this.searchText=t,this.currentPage=1,this.getSalesOrder()}),300),getSalesOrder:function(){var t=this;this.isLoading=!0,this.get({params:{join:"form,customer,items,item",fields:"sales_quotation.*",sort_by:"-form.number",group_by:"form.id",filter_form:this.formStatus.value+";"+this.formApprovalStatus.value,filter_like:{"form.number":this.searchText,"customer.name":this.searchText,"item.code":this.searchText,"item.name":this.searchText,"sales_quotation_item.notes":this.searchText,"sales_quotation_item.quantity":this.searchText,"sales_quotation_item.price":this.searchText},filter_date_min:{"form.date":this.serverDateTime(this.date.start,"start")},filter_date_max:{"form.date":this.serverDateTime(this.date.end,"end")},limit:10,includes:"form;customer;items.item;items.allocation",page:this.currentPage}}).catch((function(e){t.$notification.error(e.message)})).finally((function(){t.isLoading=!1}))},updatePage:function(t){this.currentPage=t,this.getSalesOrder()}})},f=p,v=a("2877"),_=Object(v["a"])(f,s,r,!1,null,"fa0d1da2",null);e["default"]=_.exports}}]);
//# sourceMappingURL=chunk-51ba00fd.f2ec7f96.js.map