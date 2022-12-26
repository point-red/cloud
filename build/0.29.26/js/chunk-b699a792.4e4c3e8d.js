(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b699a792"],{"055b":function(t,e,s){"use strict";var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"d-flex flex-nowrap",staticStyle:{"overflow-x":"auto"}},[e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/request")},attrs:{to:"/purchase/request","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("purchase request"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/order")},attrs:{to:"/purchase/order","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("purchase order"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/down-payment")},attrs:{to:"/purchase/down-payment","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("down payment"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/receive")},attrs:{to:"/purchase/receive","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("purchase receive"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/invoice")},attrs:{to:"/purchase/invoice","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("purchase invoice"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/payment-order")},attrs:{to:"/purchase/payment-order","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("payment order"))))])])],1)},r=[],i={data:function(){return{path:this.$route.path}},methods:{isMatch:function(t){return this.path.substring(0,t.length)==t}}},o=i,n=s("2877"),c=Object(n["a"])(o,a,r,!1,null,null,null);e["a"]=c.exports},"2bf7":function(t,e,s){},"2c5e":function(t,e,s){"use strict";s("b0c0");var a=function(){var t=this,e=t._self._c;return e("sweet-modal",{ref:"modal",attrs:{title:t._f("uppercase")("Select Purchase Order"),"overlay-theme":"dark"},on:{close:t.onClose}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.searchText,expression:"searchText"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Search..."},domProps:{value:t.searchText},on:{keydown:function(e){if(!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter"))return null;e.preventDefault()},input:function(e){e.target.composing||(t.searchText=e.target.value)}}}),e("hr"),t.isLoading?e("div",[e("h3",{staticClass:"text-center"},[t._v(" Loading ... ")])]):e("div",{staticClass:"list-group push"},t._l(t.options,(function(s,a){return e("a",{key:"purchase-order-"+a,staticClass:"list-group-item list-group-item-action",attrs:{href:"javascript:void(0)"},on:{click:function(e){return t.choose(s)}}},[e("div",{staticClass:"d-flex justify-content-between align-items-center"},[e("div",[e("strong",[t._v(t._s(s.form.number))]),e("br")]),e("div",{staticClass:"text-black-50 text-right",staticStyle:{"font-size":"0.8em"}},[e("span",{staticStyle:{"font-size":"0.8em"}},[t._v("SUPPLIER : "+t._s(t._f("uppercase")(s.supplier.name)))]),e("br"),t._v(" "+t._s(t._f("dateFormat")(s.form.created_at,"DD MMMM YYYY HH:mm"))+" ")])]),e("table",{staticClass:"table mb-0",staticStyle:{"font-size":"11px"}},t._l(s.items,(function(s,a){return e("tr",{key:"item-"+a},[e("td",{staticClass:"pl-0"},[t._v(" "+t._s(s.item.name)+" ")]),e("td",{staticClass:"w-1 text-right text-nowrap"},[t._v(" "+t._s(s.quantity)+" "+t._s(s.unit)+" ")])])})),0)])})),0),t.searchText&&0==t.options.length&&!t.isLoading?e("div",{staticClass:"alert alert-info text-center"},[t._v(" "+t._s(t._f("capitalize")(t.$t("searching not found",[t.searchText])))+" ")]):t._e(),e("div",{staticClass:"pull-right"},[e("button",{staticClass:"btn btn-sm btn-outline-danger",attrs:{type:"button"},on:{click:function(e){return t.clear()}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("clear")))+" ")])])])},r=[],i=s("5530"),o=(s("a9e3"),s("ac1f"),s("841c"),s("d3b7"),s("159b"),s("14d9"),s("b047")),n=s.n(o),c=s("2f62"),l={props:{id:{type:String,default:""},value:{type:[String,Number],default:""}},data:function(){return{index:null,searchText:"",options:[],selected:{},isLoading:!1}},watch:{searchText:n()((function(){this.search()}),300)},methods:Object(i["a"])(Object(i["a"])({},Object(c["b"])("purchaseOrder",["get"])),{},{search:function(){var t=this;this.isLoading=!0,this.get({params:{remaining_info:!0,join:"form,supplier,items,item",fields:"purchase_order.*",sort_by:"-form.number",group_by:"form.id",filter_form:"active;approvalApproved",filter_not_null:"form.number",filter_like:{"supplier.name":this.searchText},includes:"supplier;items.item.units;form.createdBy;purchaseReceives.items;purchaseReceives.form"}}).then((function(e){var s=e.data;t.options=[],s.forEach((function(e){e.purchase_receives.forEach((function(s){0==s.form.done&&t.options.push(e)}))}))})).catch((function(e){t.$notification.error(e.message)})).finally((function(){t.isLoading=!1}))},clear:function(t){this.$emit("choosen",{id:null,form:{number:null}}),this.close()},choose:function(t){this.$emit("choosen",t),this.close()},open:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.index=t,this.search(),this.$refs.modal.open()},close:function(){this.$refs.modal.close()},onClose:function(){this.$emit("close",!0)}})},u=l,p=(s("ad71"),s("2877")),d=Object(p["a"])(u,a,r,!1,null,"a0ea5d9c",null);e["a"]=d.exports},"861c":function(t,e,s){"use strict";var a=function(){var t=this,e=t._self._c;return e("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/purchase"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("purchase")))+" ")])},r=[],i=s("2877"),o={},n=Object(i["a"])(o,a,r,!1,null,null,null);e["a"]=n.exports},ad71:function(t,e,s){"use strict";s("2bf7")},f51b:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t._self._c;return e("div",[e("breadcrumb",[e("breadcrumb-purchase"),e("router-link",{staticClass:"breadcrumb-item",attrs:{to:{name:"purchase.order.index"}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("purchase order")))+" ")]),e("router-link",{staticClass:"breadcrumb-item",attrs:{to:{name:"purchase.order.show",params:{id:t.id}}}},[t._v(" "+t._s(t._f("uppercase")(t.purchaseOrder.form.number))+" ")]),e("span",{staticClass:"breadcrumb-item active"},[t._v(t._s(t._f("uppercase")(t.$t("edit"))))])],1),e("purchase-menu"),e("form",{on:{submit:function(e){return e.preventDefault(),t.onSubmit.apply(null,arguments)}}},[e("div",{staticClass:"row"},[e("p-block",[e("p-block-inner",{attrs:{"is-loading":t.isLoading}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-6"},[e("h4",[t._v(t._s(t._f("uppercase")(t.$t("purchase order"))))]),e("table",{staticClass:"table table-sm table-bordered"},[e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("form number")))+" ")]),e("td",[t._v(" "+t._s(t.purchaseOrder.form.number)+" ")])]),e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("date")))+" ")]),e("td",[t._v(" "+t._s(t._f("dateFormat")(t.purchaseOrder.form.date,"DD MMMM YYYY HH:mm"))+" ")])]),e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("purchase request")))+" ")]),e("td",[e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.selectPurchaseOrder.open()}}},[t.purchaseOrder&&null!=t.purchaseOrder.form.number?[t._v(" "+t._s(t.purchaseOrder.form.number)+" ")]:[t._v(" "+t._s(t._f("uppercase")(t.$t("select")))+" ")]],2)])])])]),e("div",{staticClass:"col-sm-6 text-right"},[e("div",{staticClass:"mb-30"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.authUser.tenant_name))+" ")]),t.authUser.branch?[t._v(" "+t._s(t._f("uppercase")(t.authUser.branch.address))+" "),t.authUser.branch.address?e("br"):t._e(),t._v(" "+t._s(t._f("uppercase")(t.authUser.branch.phone))+" "),t.authUser.branch.phone?e("br"):t._e()]:t._e()],2),e("div",[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("to")))+": ")]),e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.supplier.open()}}},[t._v(t._s(t._f("uppercase")(t.form.supplier_label||t.$t("select"))))]),t.form.supplier_phone?e("div",{staticStyle:{"font-size":"12px"}},[t.form.supplier_address?e("br"):t._e(),t._v(t._s(t._f("uppercase")(t.form.supplier_address))+" "),t.form.supplier_phone?e("br"):t._e(),t._v(t._s(t.form.supplier_phone)+" "),t.form.supplier_email?e("br"):t._e(),t._v(t._s(t._f("uppercase")(t.form.supplier_email))+" ")]):t._e()])])]),e("hr"),e("point-table",[e("tr",{attrs:{slot:"p-head"},slot:"p-head"},[e("th",[t._v("#")]),e("th",{staticStyle:{"min-width":"120px"}},[t._v(" Item ")]),e("th",[t._v("Quantity")]),e("th",[t._v("Price")]),e("th",[t._v("Discount")]),e("th",[t._v("Total")]),e("th",[e("button",{staticClass:"btn btn-sm btn-outline-secondary",attrs:{type:"button"},on:{click:function(e){return t.toggleMore()}}},[e("i",{staticClass:"fa fa-ellipsis-h"})])])]),t._l(t.form.items,(function(s,a){return[e("tr",{key:a,attrs:{slot:"p-body"},slot:"p-body"},[e("th",[t._v(t._s(a+1))]),e("td",[e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.item.open(a)}}},[t._v(" "+t._s(t._f("uppercase")(s.item_label||t.$t("select")))+" ")])]),e("td",[e("p-quantity",{attrs:{id:"quantity"+a,name:"quantity"+a,disabled:null==s.item_id,"item-id":s.item_id,units:s.units,unit:{name:s.unit,label:s.unit,converter:s.converter}},on:{choosen:function(e){return t.chooseUnit(e,s)}},model:{value:s.quantity,callback:function(e){t.$set(s,"quantity",e)},expression:"row.quantity"}})],1),e("td",[e("p-form-number",{attrs:{id:"price"+a,name:"price"+a,readonly:null==s.item_id},model:{value:s.price,callback:function(e){t.$set(s,"price",t._n(e))},expression:"row.price"}})],1),e("td",[e("p-discount",{attrs:{id:"discount"+a,name:"discount"+a,readonly:null==s.item_id,"base-value":s.price,"discount-percent":s.discount_percent,"discount-value":s.discount_value},on:{"update:discountPercent":function(e){return t.$set(s,"discount_percent",e)},"update:discount-percent":function(e){return t.$set(s,"discount_percent",e)},"update:discountValue":function(e){return t.$set(s,"discount_value",e)},"update:discount-value":function(e){return t.$set(s,"discount_value",e)}}})],1),e("td",[e("p-form-number",{attrs:{id:"total-"+a,name:"total-"+a,readonly:!0,value:s.quantity*(s.price-s.discount_value)}})],1),e("td",[t.isSaving?t._e():e("button",{staticClass:"btn btn-sm btn-outline-secondary",attrs:{type:"button"},on:{click:function(t){s.more=!s.more}}},[e("i",{staticClass:"fa fa-ellipsis-h"})])])]),s.more&&s.item_id?[e("tr",{key:"ext-"+a,staticClass:"bg-gray-light",attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"bg-gray-light"}),e("td",{attrs:{colspan:"4"}},[e("p-form-row",{attrs:{id:"allocation",name:"allocation",label:t.$t("allocation")}},[e("div",{staticClass:"col-lg-9 mt-5",attrs:{slot:"body"},slot:"body"},[e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.allocation.open(a)}}},[t._v(" "+t._s(t._f("uppercase")(s.allocation_name||t.$t("select")))+" ")])])])],1),e("td"),e("td")]),e("tr",{key:"ext-"+a,staticClass:"bg-gray-light",attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"bg-gray-light"}),e("td",{attrs:{colspan:"4"}},[e("p-form-row",{attrs:{id:"notes",name:"notes",label:t.$t("notes")},model:{value:s.notes,callback:function(e){t.$set(s,"notes",e)},expression:"row.notes"}})],1),e("td"),e("td")])]:t._e()]})),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td"),e("td",[e("p-form-number",{attrs:{id:"subtotal",name:"subtotal",readonly:!0,value:t.subtotal}})],1)])],2),e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-6"},[e("textarea",{directives:[{name:"model",rawName:"v-model",value:t.form.notes,expression:"form.notes"}],staticClass:"form-control",attrs:{rows:"14",placeholder:"Notes"},domProps:{value:t.form.notes},on:{input:function(e){e.target.composing||t.$set(t.form,"notes",e.target.value)}}})]),e("div",{staticClass:"col-sm-6"},[e("p-form-row",{attrs:{id:"discount",name:"discount",label:t.$t("discount")}},[e("div",{staticClass:"col-lg-9 mt-5",attrs:{slot:"body"},slot:"body"},[e("p-discount",{attrs:{id:"discount",name:"discount","base-value":t.subtotal,"discount-percent":t.form.discount_percent,"discount-value":t.form.discount_value},on:{"update:discountPercent":function(e){return t.$set(t.form,"discount_percent",e)},"update:discount-percent":function(e){return t.$set(t.form,"discount_percent",e)},"update:discountValue":function(e){return t.$set(t.form,"discount_value",e)},"update:discount-value":function(e){return t.$set(t.form,"discount_value",e)}}})],1)]),e("p-form-row",{attrs:{id:"tax-base",name:"tax-base",label:t.$t("tax base")}},[e("div",{staticClass:"col-lg-9 mt-5",attrs:{slot:"body"},slot:"body"},[e("p-form-number",{attrs:{id:"tax-base",name:"tax-base",readonly:!0,value:t.tax_base}})],1)]),e("p-form-row",{attrs:{name:"tax",label:t.$t("tax")}},[e("div",{staticClass:"col-lg-9",attrs:{slot:"body"},slot:"body"},[e("p-form-check-box",{staticClass:"mb-0",staticStyle:{float:"left"},attrs:{name:"tax",checked:"include"==t.form.type_of_tax,description:t.$t("include tax")},nativeOn:{click:function(e){return t.chooseTax("include")}}}),e("p-form-check-box",{attrs:{name:"tax",checked:"exclude"==t.form.type_of_tax,description:t.$t("exclude tax")},nativeOn:{click:function(e){return t.chooseTax("exclude")}}}),e("p-form-number",{attrs:{id:"tax-value",name:"tax-value",readonly:!0,value:t.tax}})],1)]),e("p-form-row",{attrs:{id:"total",name:"total",label:t.$t("total")}},[e("div",{staticClass:"col-lg-9 mt-5",attrs:{slot:"body"},slot:"body"},[e("p-form-number",{attrs:{id:"total",name:"total",readonly:!0,value:t.grandTotal}})],1)])],1)]),e("hr"),e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-6"}),e("div",{staticClass:"col-sm-3 text-center"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("requested by")))+" ")]),e("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[t._v(" "+t._s(t._f("dateFormat")(Date.now(),"DD MMMM YYYY"))+" ")]),t._v(" "+t._s(t._f("uppercase")(t.requestedBy))+" "),e("div",{staticClass:"d-sm-block d-md-none mt-10"})]),e("div",{staticClass:"col-sm-3 text-center"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("approved by")))+" ")]),e("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[t._v(" _______________ ")]),e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.approver.open()}}},[t._v(t._s(t._f("uppercase")(t.form.approver_name||t.$t("select"))))]),e("br"),e("span",{staticStyle:{"font-size":"9px"}},[t._v(t._s(t._f("uppercase")(t.form.approver_email)))])]),e("div",{staticClass:"col-sm-12"},[e("hr"),e("button",{staticClass:"btn btn-block btn-sm btn-primary",attrs:{type:"submit",disabled:t.isSaving}},[e("i",{directives:[{name:"show",rawName:"v-show",value:t.isSaving,expression:"isSaving"}],staticClass:"fa fa-asterisk fa-spin"}),t._v(" "+t._s(t._f("uppercase")(t.$t("update")))+" ")])])])],1)],1)],1)]),e("m-supplier",{ref:"supplier",on:{choosen:t.chooseSupplier}}),e("m-item",{ref:"item",on:{choosen:t.chooseItem}}),e("m-user",{ref:"approver",on:{choosen:t.chooseApprover}}),e("m-allocation",{ref:"allocation",on:{choosen:function(e){return t.chooseAllocation(e)}}}),e("select-purchase-order",{ref:"selectPurchaseOrder",on:{choosen:t.choosePurchaseOrder}})],1)},r=[],i=s("5530"),o=(s("13d5"),s("d3b7"),s("7db0"),s("159b"),s("14d9"),s("a434"),s("b0c0"),s("d81d"),s("4de4"),s("055b")),n=s("5ae6"),c=s("861c"),l=s("b7ae"),u=s("feee"),p=s("2c5e"),d=s("2f62"),m={components:{PurchaseMenu:o["a"],PointTable:u["a"],Breadcrumb:n["a"],BreadcrumbPurchase:c["a"],SelectPurchaseOrder:p["a"]},data:function(){return{id:this.$route.params.id,isSaving:!1,isLoading:!1,requestedBy:localStorage.getItem("fullName"),purchaseOrder:null,form:new l["a"]({id:this.$route.params.id,purchase_request_id:null,increment_group:this.$moment().format("YYYYMM"),date:this.$moment().format("YYYY-MM-DD HH:mm:ss"),supplier_id:null,supplier_name:null,supplier_label:null,supplier_address:null,supplier_phone:null,supplier_email:null,need_down_payment:0,cash_only:!1,notes:null,discount_percent:0,discount_value:0,tax_base:0,tax:0,type_of_tax:"exclude",items:[],request_approval_to:null,approver_name:null,approver_email:null})}},computed:Object(i["a"])(Object(i["a"])(Object(i["a"])({},Object(d["c"])("purchaseOrder",["purchaseOrder"])),Object(d["c"])("auth",["authUser"])),{},{subtotal:function(){return this.form.items.reduce((function(t,e){return t+e.quantity*(e.price-e.discount_value)}),0)},tax_base:function(){return this.subtotal-this.form.discount_value},tax:function(){var t=0;return"include"==this.form.type_of_tax?t=this.tax_base-10*this.tax_base/11:"exclude"==this.form.type_of_tax&&(t=this.tax_base/10),t},grandTotal:function(){return"include"==this.form.type_of_tax?this.subtotal-this.form.discount_value:this.subtotal-this.form.discount_value+this.tax}}),created:function(){var t=this;this.isLoading=!0,this.find({id:this.$route.params.id,params:{includes:"form.requestApprovalTo;supplier;items.item.units;items.allocation;purchaseOrder.form"}}).then((function(e){t.isLoading=!1,e.data.purchase_request&&(t.form.purchase_request_id=e.data.purchase_request.id),t.form.date=e.data.form.date,t.form.supplier_id=e.data.supplier_id,t.form.supplier_name=e.data.supplier_name,t.form.supplier_label=e.data.supplier.label,t.form.discount_percent=e.data.discount_percent,t.form.discount_value=e.data.discount_value,t.form.notes=e.data.form.notes,t.form.type_of_tax=e.data.type_of_tax,t.form.amount=e.data.amount,t.form.discount_value=e.data.discount_value,t.form.discount_percent=e.data.discount_percent,t.form.items=e.data.items,t.form.request_approval_to=e.data.form.request_approval_to.id,t.form.approver_name=e.data.form.request_approval_to.full_name,t.form.approver_email=e.data.form.request_approval_to.email,t.form.items.forEach((function(t){t.item_label=t.item.label,t.units=t.item.units})),t.purchaseOrder=e.data.purchase_request,t.addItemRow()})).catch((function(e){t.isLoading=!1,t.$notification.error(e.message)}))},methods:Object(i["a"])(Object(i["a"])({},Object(d["b"])("purchaseOrder",["find","update"])),{},{addItemRow:function(){this.form.items.push({item_id:null,item_name:null,more:!1,unit:null,converter:null,quantity:0,price:0,discount_percent:0,discount_value:0,allocation_id:null,allocation_name:"",notes:null})},toggleMore:function(){var t=this.form.items.some((function(t,e){return!1===t.more}));this.form.items.forEach((function(e){e.more=t}))},clearItem:function(t){this.form.items.splice(t,1),0===this.form.items.length&&this.addItemRow()},chooseApprover:function(t){this.form.request_approval_to=t.id,this.form.approver_name=t.fullName,this.form.approver_email=t.email},chooseSupplier:function(t){this.form.supplier_id=t.id,this.form.supplier_name=t.name,this.form.supplier_label=t.label,this.form.supplier_address=t.address,this.form.supplier_phone=t.phone,this.form.supplier_email=t.email},chooseItem:function(t){if(null!=t.id){var e=this.form.items[t.index];e.item_id=t.id,e.item_name=t.name,e.item_label=t.label,e.units=t.units,e.units.forEach((function(s,a){s.id==t.unit_default_purchase&&(e.unit=s.label,e.converter=s.converter)}));var s=!0;this.form.items.forEach((function(t){null==t.item_id&&(s=!1)})),s&&this.addItemRow()}else this.clearItem(t.index)},chooseUnit:function(t,e){e.unit=t.label,e.converter=t.converter},chooseAllocation:function(t){var e=this.form.items[t.index];e.allocation_id=t.id,e.allocation_name=t.name},chooseTax:function(t){t==this.form.type_of_tax?this.form.type_of_tax=null:this.form.type_of_tax=t},choosePurchaseOrder:function(t){this.purchaseOrder=t,this.form.purchase_request_id=t.id,this.form.items=t.items.map((function(t){return{purchase_request_item_id:t.id,item_id:t.item_id,item_name:t.item.name,item_label:t.item.name,more:!1,unit:t.unit,converter:t.converter,quantity:t.quantity,price:t.price,discount_percent:0,discount_value:0,total:t.quantity*(t.price-t.discount_value),allocation_id:t.allocation_id,allocation_name:"",notes:t.notes}})),this.addItemRow()},onSubmit:function(){var t=this;if(this.isSaving=!0,null==this.form.request_approval_to)return this.$notification.error("approval cannot be null"),this.isSaving=!1,void this.form.errors.record({request_approval_to:["Approver should not empty"]});this.form.increment_group=this.$moment(this.form.date).format("YYYYMM"),this.form.subtotal=this.subtotal,this.form.tax_base=this.tax_base,this.form.tax=this.tax,this.form.total=this.total,this.form.items=this.form.items.filter((function(t){return t.item_id})),this.update(this.form).then((function(e){t.isSaving=!1,t.$notification.success("update success"),Object.assign(t.$data,t.$options.data.call(t)),t.$router.push("/purchase/order/"+e.data.id)})).catch((function(e){t.isSaving=!1,t.$notification.error(e.message),t.form.errors.record(e.errors)}))}})},f=m,_=s("2877"),h=Object(_["a"])(f,a,r,!1,null,null,null);e["default"]=h.exports}}]);
//# sourceMappingURL=chunk-b699a792.4e4c3e8d.js.map