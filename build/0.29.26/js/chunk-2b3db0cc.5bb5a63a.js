(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2b3db0cc"],{"208e":function(t,e,a){"use strict";var s=function(){var t=this,e=t._self._c;return e("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("sales")))+" ")])},o=[],n=a("2877"),l={},r=Object(n["a"])(l,s,o,!1,null,null,null);e["a"]=r.exports},cb31:function(t,e,a){"use strict";a("f712")},e38f:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t._self._c;return e("div",[t.salesPaymentCollection?e("breadcrumb",[e("breadcrumb-sales"),e("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales/payment-collection"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("sales payment collection")))+" ")]),e("span",{staticClass:"breadcrumb-item active"},[t.salesPaymentCollection.form.number?e("span",[t._v(" "+t._s(t._f("uppercase")(t.salesPaymentCollection.form.number))+" ")]):t._e(),t.salesPaymentCollection.form.edited_number?e("span",[t._v(" "+t._s(t._f("uppercase")(t.$t("archive")))+" ")]):t._e()])],1):t._e(),e("sales-menu"),e("p-show-form-approval-status",{attrs:{"is-loading":t.isLoading,"approved-by":t.salesPaymentCollection.form.request_approval_to.full_name,"cancellation-status":t.salesPaymentCollection.form.cancellation_status,"approval-status":t.salesPaymentCollection.form.approval_status,"approval-reason":t.salesPaymentCollection.form.approval_reason},on:{onApprove:t.onApprove,onReject:t.onReject}}),e("p-show-form-cancellation-status",{attrs:{"is-loading":t.isLoading,"cancellation-status":t.salesPaymentCollection.form.cancellation_status,"cancellation-approval-reason":t.salesPaymentCollection.form.cancellation_approval_reason,"request-cancellation-reason":t.salesPaymentCollection.form.request_cancellation_reason},on:{onCancellationApprove:t.onCancellationApprove,onCancellationReject:t.onCancellationReject}}),t.salesPaymentCollection?e("div",{staticClass:"row"},[e("p-block",[e("p-block-inner",{attrs:{"is-loading":t.isLoading}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-12"},[t.salesPaymentCollection.form.edited_number?e("h3",[t._v(" "+t._s(t._f("uppercase")(t.$t("archive")))+" ")]):t._e(),t.salesPaymentCollection.form.number?e("span",[e("div",{staticClass:"text-right"},[e("button",{staticClass:"mr-3 btn btn-sm btn-outline-secondary mr-5",attrs:{title:"Print payment collection"},on:{click:function(){return t.$refs["print-payment-collection"].open()}}},[e("i",{staticClass:"si si-printer"})]),t.$permission.has("create sales payment collection")?e("router-link",{staticClass:"btn btn-sm btn-outline-secondary mr-5",attrs:{to:{name:"sales.payment-collection.create"}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("create")))+" ")]):t._e(),t.$permission.has("update sales payment collection")?e("router-link",{staticClass:"btn btn-sm btn-outline-secondary mr-5",attrs:{to:{name:"sales.payment-collection.edit",params:{id:t.salesPaymentCollection.id}}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("edit")))+" ")]):t._e(),null!=t.salesPaymentCollection.form.cancellation_status&&-1!=t.salesPaymentCollection.form.cancellation_status||!t.$permission.has("delete sales payment collection")?t._e():e("button",{staticClass:"btn btn-sm btn-outline-secondary mr-5",on:{click:function(e){return t.$refs.formRequestDelete.open()}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("delete")))+" ")]),e("m-form-request-delete",{ref:"formRequestDelete",on:{delete:function(e){return t.onDelete(e)}}})],1)]):t._e()])]),e("hr"),e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-6"},[e("h4",[t._v(t._s(t._f("uppercase")(t.$t("sales payment collection"))))]),e("table",{staticClass:"table table-sm table-bordered"},[e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("date")))+" ")]),e("td",[t._v(t._s(t._f("dateFormat")(t.salesPaymentCollection.date,"DD MMMM YYYY")))])]),e("tr",[e("td",{staticClass:"font-weight-bold",attrs:{width:"150px"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("form number")))+" ")]),t.salesPaymentCollection.form.number?e("td",[t._v(" "+t._s(t.salesPaymentCollection.form.number)+" ")]):t._e(),t.salesPaymentCollection.form.edited_number?e("td",[t._v(" "+t._s(t.salesPaymentCollection.form.edited_number)+" ")]):t._e()]),t.salesPaymentCollection.payment_type?e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("payment method")))+" ")]),e("td",[t._v(t._s(t._f("uppercase")(t.salesPaymentCollection.payment_type)))])]):t._e()])]),e("div",{staticClass:"col-sm-6 text-right"},[e("h6",{staticClass:"mb-5"},[t._v(" "+t._s(t._f("uppercase")(t.authUser.tenant_name))+" ")]),t.salesPaymentCollection.form.branch?[t._v(" "+t._s(t._f("uppercase")(t.salesPaymentCollection.form.branch.address))+" "),t.salesPaymentCollection.form.branch.phone?e("br"):t._e(),t._v(t._s(t._f("uppercase")(t.salesPaymentCollection.form.branch.phone))+" ")]:t._e(),e("h6",{staticClass:"mt-30 mb-5"},[t._v(" "+t._s(t._f("uppercase")(t.$t("customer")))+" ")]),t._v(" "+t._s(t._f("uppercase")(t.salesPaymentCollection.customer_name))+" "),e("div",{staticStyle:{"font-size":"12px"}},[t._v(" "+t._s(t._f("uppercase")(t.salesPaymentCollection.customer.customer_address))+" "),t.salesPaymentCollection.customer.customer_phone?e("br"):t._e(),t._v(t._s(t.salesPaymentCollection.customer.customer_phone)+" "),t.salesPaymentCollection.customer.customer_email?e("br"):t._e(),t._v(t._s(t._f("uppercase")(t.salesPaymentCollection.customer.customer_email))+" ")])],2)]),e("hr"),t.details.salesInvoice.length>0?e("div",[e("h5",[t._v(t._s(t._f("uppercase")(t.$t("invoice collection"))))]),e("point-table",[e("tr",{attrs:{slot:"p-head"},slot:"p-head"},[e("th",{staticClass:"text-center"},[t._v(" # ")]),e("th",{attrs:{width:"20%"}},[t._v(" Date ")]),e("th",{attrs:{width:"20%"}},[t._v(" Form Number ")]),e("th",{attrs:{width:"15%"}},[t._v(" Notes ")]),e("th",{staticClass:"text-right",attrs:{width:"20%"}},[t._v(" Available Invoice ")]),e("th",{staticClass:"text-right",attrs:{width:"20%"}},[t._v(" Invoice ")])]),t._l(t.details.salesInvoice,(function(a,s){return[e("tr",{key:s,attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"text-center"},[t._v(" "+t._s(s+1)+" ")]),e("td",[t._v(t._s(t._f("dateFormat")(a.referenceable_form_date,"DD MMMM YYYY")))]),e("td",[t._v(t._s(a.referenceable_form_number))]),e("td",[t._v(t._s(a.referenceable_form_notes))]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.available))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.amount))+" ")])])]}))],2)],1):t._e(),t.details.salesDownPayment.length>0?e("div",[e("h5",[t._v(t._s(t._f("uppercase")(t.$t("down payment collection"))))]),e("point-table",[e("tr",{attrs:{slot:"p-head"},slot:"p-head"},[e("th",{staticClass:"text-center"},[t._v(" # ")]),e("th",{attrs:{width:"20%"}},[t._v(" Date ")]),e("th",{attrs:{width:"20%"}},[t._v(" Form Number ")]),e("th",{attrs:{width:"15%"}},[t._v(" Notes ")]),e("th",{staticClass:"text-right",attrs:{width:"20%"}},[t._v(" Available Down Payment ")]),e("th",{staticClass:"text-right",attrs:{width:"20%"}},[t._v(" Down Payment ")])]),t._l(t.details.salesDownPayment,(function(a,s){return[e("tr",{key:s,attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"text-center"},[t._v(" "+t._s(s+1)+" ")]),e("td",[t._v(t._s(t._f("dateFormat")(a.referenceable_form_date,"DD MMMM YYYY")))]),e("td",[t._v(t._s(a.referenceable_form_number))]),e("td",[t._v(t._s(a.referenceable_form_notes))]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.available))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.amount))+" ")])])]}))],2)],1):t._e(),t.details.salesReturn.length>0?e("div",[e("h5",[t._v(t._s(t._f("uppercase")(t.$t("return collection"))))]),e("point-table",[e("tr",{attrs:{slot:"p-head"},slot:"p-head"},[e("th",{staticClass:"text-center"},[t._v(" # ")]),e("th",{attrs:{width:"20%"}},[t._v(" Date ")]),e("th",{attrs:{width:"20%"}},[t._v(" Form Number ")]),e("th",{attrs:{width:"15%"}},[t._v(" Notes ")]),e("th",{staticClass:"text-right",attrs:{width:"20%"}},[t._v(" Available Return ")]),e("th",{staticClass:"text-right",attrs:{width:"20%"}},[t._v(" Return ")])]),t._l(t.details.salesReturn,(function(a,s){return[e("tr",{key:s,attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"text-center"},[t._v(" "+t._s(s+1)+" ")]),e("td",[t._v(t._s(t._f("dateFormat")(a.referenceable_form_date,"DD MMMM YYYY")))]),e("td",[t._v(t._s(a.referenceable_form_number))]),e("td",[t._v(t._s(a.referenceable_form_notes))]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.available))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.amount))+" ")])])]}))],2)],1):t._e(),t.details.other.length>0?e("div",[e("h5",[t._v(t._s(t._f("uppercase")(t.$t("other collection"))))]),e("point-table",[e("tr",{attrs:{slot:"p-head"},slot:"p-head"},[e("th",{staticClass:"text-center",attrs:{width:"5%"}},[t._v(" # ")]),e("th",{attrs:{width:"40%"}},[t._v(" Account ")]),e("th",{attrs:{width:"15%"}},[t._v(" Notes ")]),e("th",{staticClass:"text-right",attrs:{width:"20%"}},[t._v(" Amount ")]),e("th",{attrs:{width:"20%"}},[t._v(" Allocation ")])]),t._l(t.details.other,(function(a,s){return[e("tr",{key:s,attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"text-center"},[t._v(" "+t._s(s+1)+" ")]),e("td",[t._v(t._s(a.chart_of_account.label))]),e("td",[t._v(t._s(a.notes)+" "+t._s(a.unit))]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.amount))+" ")]),e("td",[t._v(" "+t._s(a.allocation?a.allocation.label:"")+" ")])])]}))],2)],1):t._e(),e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-7"}),e("div",{staticClass:"col-sm-5"},[e("point-table",[e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("td",[t._v("Total Invoice")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.total_invoice))+" ")])]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("td",[t._v("Total Down Payment")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.total_down_payment))+" ")])]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("td",[t._v("Total Return")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.total_return))+" ")])]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("td",[t._v("Total Other")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.total_other))+" ")])]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("td",[t._v("Total Amount")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.salesPaymentCollection.amount))+" ")])])])],1)]),e("div",{staticClass:"row mt-50"},[e("div",{staticClass:"col-sm-6"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("notes")))+" ")]),e("div",{staticStyle:{"white-space":"pre-wrap"}},[t._v(" "+t._s(t.salesPaymentCollection.form.notes)+" ")]),e("div",{staticClass:"d-sm-block d-md-none mt-10"})]),e("div",{staticClass:"col-sm-3 text-center"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("requested by")))+" ")]),e("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[t._v(" "+t._s(t._f("dateFormat")(t.salesPaymentCollection.form.date,"DD MMMM YYYY"))+" ")]),t._v(" "+t._s(t._f("uppercase")(t.salesPaymentCollection.form.created_by.full_name))+" "),e("div",{staticClass:"d-sm-block d-md-none mt-10"})]),e("div",{staticClass:"col-sm-3 text-center"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("approved by")))+" ")]),e("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[t.salesPaymentCollection.form.approval_at?[t._v(" "+t._s(t._f("dateFormat")(t.salesPaymentCollection.form.approval_at,"DD MMMM YYYY"))+" ")]:[t._v(" _______________ ")]],2),t._v(" "+t._s(t._f("uppercase")(t.salesPaymentCollection.form.request_approval_to.full_name))+" "),e("div",{staticStyle:{"font-size":"11px"}},[t._v(" "+t._s(t._f("lowercase")(t.salesPaymentCollection.form.request_approval_to.email))+" ")])])])])],1)],1):t._e(),e("m-form-request-delete",{ref:"formRequestDelete",on:{delete:function(e){return t.onDelete(e)}}}),e("sweet-modal",{ref:"send-report-modal",attrs:{title:t._f("uppercase")(t.$t("send payment collection")),"overlay-theme":"dark"}},[e("form",{on:{submit:function(e){return e.preventDefault(),t.sendPaymentCollection.apply(null,arguments)}}},[e("p-form-row",{ref:"send-payment-collection-email",attrs:{id:"send-payment-collection-email",type:"email",required:"",disabled:!!t.salesPaymentCollection.customer.email,label:t._f("uppercase")(t.$t("email")),"is-horizontal":!1},model:{value:t.sendPaymentCollectionData.email,callback:function(e){t.$set(t.sendPaymentCollectionData,"email",e)},expression:"sendPaymentCollectionData.email"}}),e("div",{staticClass:"form-group"},[e("label",{staticClass:"col-form-label",attrs:{for:"send-payment-collection-message"}},[t._v(t._s(t._f("uppercase")("Message")))]),e("div",[e("textarea",{directives:[{name:"model",rawName:"v-model",value:t.sendPaymentCollectionData.message,expression:"sendPaymentCollectionData.message"}],staticClass:"form-control",attrs:{id:"send-payment-collection-message",name:"send-payment-collection-message",cols:"30",rows:"10"},domProps:{value:t.sendPaymentCollectionData.message},on:{input:function(e){e.target.composing||t.$set(t.sendPaymentCollectionData,"message",e.target.value)}}})])]),e("div",{staticClass:"pull-right"},[e("button",{staticClass:"btn btn-primary",attrs:{type:"submit"}},[t._v(" Send ")])])],1)]),e("print-payment-collection",{ref:"print-payment-collection",attrs:{paymentcollection:t.salesPaymentCollection,details:t.details,totalinvoice:t.total_invoice,totaldownpayment:t.total_down_payment,totalreturn:t.total_return,totalother:t.total_other}})],1)},o=[],n=a("5530"),l=(a("d3b7"),a("7db0"),a("159b"),a("14d9"),a("bea4")),r=a("5ae6"),i=a("208e"),c=a("feee"),_=(a("b0c0"),function(){var t=this,e=t._self._c;return e("sweet-modal",{ref:"print-sales-collection",attrs:{title:t._f("uppercase")(t.$t("print sales collection")),"overlay-theme":"dark"},on:{close:function(e){return t.onClose()}}},[e("table",{staticClass:"print-sales-collection-container m-2 mb-4 mx-auto",attrs:{id:"print-sales-collection"}},[e("thead",[e("tr",[e("td",[e("div",{staticClass:"d-flex justify-content-between",staticStyle:{"margin-bottom":"10px"}},[e("div",{staticStyle:{width:"110px",height:"110px","align-self":"center"}},[e("img",{staticStyle:{width:"100px",height:"100px"},attrs:{src:t.logoUrl,alt:"Logo"}})]),e("div",{staticClass:"company-detail"},[e("h1",{staticStyle:{"margin-top":"0","margin-bottom":"5px"}},[t._v(" Payment Collection ")]),e("h3",{staticClass:"my-5px",staticStyle:{"line-height":"22px"}},[t._v(" "+t._s(t.tenantName)+" ")]),e("p",{staticClass:"my-5px",staticStyle:{"line-height":"15px"}},[t._v(" "+t._s(t.tenantAddress)+" ")]),e("p",{staticClass:"my-5px"},[t._v(" "+t._s(t.tenantPhone)+" ")])])]),e("hr",{staticClass:"header-divider"}),e("div",{staticClass:"d-flex justify-content-between",staticStyle:{"margin-top":"10px","margin-bottom":"10px"}},[e("table",{staticClass:"header-detail",staticStyle:{"margin-right":"20px"}},[e("tr",[e("td",[t._v("Date")]),e("td",[t._v(":")]),e("td",[t._v(t._s(t._f("dateFormat")(t.paymentcollection.date,"DD MMMM YYYY")))])]),e("tr",[e("td",[t._v("Invoice number")]),e("td",[t._v(":")]),e("td",[t._v(t._s(t.paymentcollection.form.number))])])]),e("table",{staticClass:"header-detail",staticStyle:{"margin-left":"20px"}},[e("tr",[e("td",[t._v("Customer")]),e("td",[t._v(":")]),e("td",[t._v(t._s(t.paymentcollection.customer.name||"-"))])]),e("tr",[e("td",[t._v("Address")]),e("td",[t._v(":")]),e("td",[t._v(t._s(t.paymentcollection.customer.address||"-"))])]),e("tr",[e("td",[t._v("Phone number")]),e("td",[t._v(":")]),e("td",[t._v(t._s(t.paymentcollection.customer.phone||"-"))])])])])])])]),e("tbody",[t.details.salesInvoice.length>0?e("tr",[e("td",[e("h3",[t._v("Invoice Collection")]),e("table",{staticClass:"table-items",staticStyle:{width:"100%"}},[e("thead",[e("tr",[e("th",[t._v("Date")]),e("th",[t._v("Form Number")]),e("th",[t._v("Notes")]),e("th",[t._v("Available Invoice")]),e("th",[t._v("Amount Collection")])])]),t._l(t.details.salesInvoice,(function(a,s){return e("tr",{key:s},[e("td",[t._v(" "+t._s(t._f("dateFormat")(a.referenceable_form_date,"DD MMMM YYYY"))+" ")]),e("td",[t._v(" "+t._s(a.referenceable_form_number)+" ")]),e("td",[t._v(" "+t._s(a.referenceable_form_notes)+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.available))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.amount))+" ")])])}))],2)])]):t._e(),t.details.salesDownPayment.length>0?e("tr",[e("td",[e("h3",[t._v("Down Payment Collection")]),e("table",{staticClass:"table-items",staticStyle:{width:"100%"}},[e("thead",[e("tr",[e("th",[t._v("Date")]),e("th",[t._v("Form Number")]),e("th",[t._v("Notes")]),e("th",[t._v("Available Invoice")]),e("th",[t._v("Amount Collection")])])]),t._l(t.details.salesDownPayment,(function(a,s){return e("tr",{key:s},[e("td",[t._v(" "+t._s(t._f("dateFormat")(a.referenceable_form_date,"DD MMMM YYYY"))+" ")]),e("td",[t._v(" "+t._s(a.referenceable_form_number)+" ")]),e("td",[t._v(" "+t._s(a.referenceable_form_notes)+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.available))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.amount))+" ")])])}))],2)])]):t._e(),t.details.salesReturn.length>0?e("tr",[e("td",[e("h3",[t._v("Sales Return Collection")]),e("table",{staticClass:"table-items",staticStyle:{width:"100%"}},[e("thead",[e("tr",[e("th",[t._v("Date")]),e("th",[t._v("Form Number")]),e("th",[t._v("Notes")]),e("th",[t._v("Available Invoice")]),e("th",[t._v("Amount Collection")])])]),t._l(t.details.salesReturn,(function(a,s){return e("tr",{key:s},[e("td",[t._v(" "+t._s(t._f("dateFormat")(a.referenceable_form_date,"DD MMMM YYYY"))+" ")]),e("td",[t._v(" "+t._s(a.referenceable_form_number)+" ")]),e("td",[t._v(" "+t._s(a.referenceable_form_notes)+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.available))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.amount))+" ")])])}))],2)])]):t._e(),t.details.other.length>0?e("tr",[e("td",[e("h3",[t._v("Other Collection")]),e("table",{staticClass:"table-items",staticStyle:{width:"100%"}},[e("thead",[e("tr",[e("th",[t._v("Account")]),e("th",[t._v("Notes")]),e("th",[t._v("Amount Collection")]),e("th",[t._v("Allocation")])])]),t._l(t.details.other,(function(a,s){return e("tr",{key:s},[e("td",[t._v(" "+t._s(a.chart_of_account.label)+" ")]),e("td",[t._v(" "+t._s(a.notes)+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(a.amount))+" ")]),e("td",[t._v(" "+t._s(a.allocation?a.allocation.label:"")+" ")])])}))],2)])]):t._e(),e("tr",[e("td",[e("div",{staticClass:"d-flex justify-content-end"},[e("table",{staticClass:"table-items",staticStyle:{width:"70%"}},[e("tr",[e("td",[t._v("Total Invoice")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.totalinvoice))+" ")])]),e("tr",[e("td",[t._v("Total Down Payment")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.totaldownpayment))+" ")])]),e("tr",[e("td",[t._v("Total Return")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.totalreturn))+" ")])]),e("tr",[e("td",[t._v("Total Other")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.totalother))+" ")])]),e("tr",[e("td",[t._v("Total Amount")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(t.paymentcollection.amount))+" ")])])])])])]),e("tr",[e("td",[e("span",[t._v("Notes: "+t._s(t.notes))]),e("div",{staticClass:"d-flex justify-content-end",staticStyle:{"margin-top":"75px"}},[e("div",{staticClass:"text-center",staticStyle:{"margin-right":"75px"}},[e("h3",[t._v("Created by")]),e("br"),e("br"),e("br"),t._v(" "+t._s(t.paymentcollection.form.created_by.full_name)+" ")]),e("div",{staticClass:"text-center"},[e("h3",[t._v("Approved by")]),e("br"),e("br"),e("br"),t._v(" "+t._s(t.paymentcollection.form.request_approval_to.full_name)+" ")])])])])]),e("tfoot")]),e("div",{staticClass:"pull-right"},[e("button",{directives:[{name:"print",rawName:"v-print",value:"print-sales-collection",expression:"'print-sales-collection'"}],staticClass:"btn btn-sm btn-outline-secondary mt-3",attrs:{type:"button"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("print")))+" ")])])])}),m=[],d=a("c7eb"),u=a("1da1"),p=(a("a9e3"),a("3ca3"),a("ddb0"),a("fa1a")),v=a("7b1d"),h=a.n(v),f={directives:{print:h.a},props:{paymentcollection:{type:Object,required:!0},details:{type:Object,required:!0},totalinvoice:{type:Number,required:!0},totaldownpayment:{type:Number,required:!0},totalreturn:{type:Number,required:!0},totalother:{type:Number,required:!0}},data:function(){return{onLoad:!0,logoUrl:"",notes:""}},computed:{tenantName:function(){return localStorage.getItem("tenantName")},tenantAddress:function(){var t=localStorage.getItem("tenantAddress");return t&&"null"!==t||(t="-"),t},tenantPhone:function(){var t=localStorage.getItem("tenantPhone");return t&&"null"!==t||(t="-"),t}},created:function(){var t=this;return Object(u["a"])(Object(d["a"])().mark((function e(){return Object(d["a"])().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.onLoad=!0,e.next=3,Promise.all([t.getSettingLogo(),t.getSettingEndNote()]);case 3:t.onLoad=!1;case 4:case"end":return e.stop()}}),e)})))()},methods:{clear:function(){this.mutableId=null,this.mutableLabel=null,this.$emit("choosen",""),this.close()},open:function(){this.$refs["print-sales-collection"].open()},close:function(){this.$refs["select-"+this.id].close()},onClose:function(){this.$emit("close",!0)},getSettingLogo:function(){var t=this;return Object(u["a"])(Object(d["a"])().mark((function e(){var a,s;return Object(d["a"])().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,p["a"].get("/setting/logo");case 3:a=e.sent,s=a.data.data,t.logoUrl=s.publicUrl,e.next=11;break;case 8:e.prev=8,e.t0=e["catch"](0),console.log(e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))()},getSettingEndNote:function(){var t=this;return Object(u["a"])(Object(d["a"])().mark((function e(){var a,s;return Object(d["a"])().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,p["a"].get("/setting/end-note");case 3:a=e.sent,s=a.data.data,t.notes=s.salesInvoice,e.next=11;break;case 8:e.prev=8,e.t0=e["catch"](0),console.log(e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))()}}},b=f,y=(a("cb31"),a("2877")),C=Object(y["a"])(b,_,m,!1,null,"c3e1da74",null),g=C.exports,w=a("2f62"),P={components:{SalesMenu:l["a"],Breadcrumb:r["a"],BreadcrumbSales:i["a"],PointTable:c["a"],PrintPaymentCollection:g},data:function(){return{id:this.$route.params.id,isLoading:!1,isDeleting:!1,total_invoice:0,total_down_payment:0,total_return:0,total_other:0,total_amount:0,details:{salesInvoice:[],salesDownPayment:[],salesReturn:[],other:[]},sendPaymentCollectionData:{email:"",message:""}}},computed:Object(n["a"])(Object(n["a"])({},Object(w["c"])("salesPaymentCollection",["salesPaymentCollection"])),Object(w["c"])("auth",["authUser"])),watch:{$route:function(t,e){t.params.id!=e.params.id&&(this.id=t.params.id,this.salesPaymentCollectionRequest())}},created:function(){this.salesPaymentCollectionRequest()},methods:Object(n["a"])(Object(n["a"])(Object(n["a"])({},Object(w["b"])("salesPaymentCollection",{find:"find",delete:"delete",approve:"approve",reject:"reject",cancellationApprove:"cancellationApprove",cancellationReject:"cancellationReject",addHistories:"addHistories"})),Object(w["b"])("salesPaymentCollectionApproval",["sendCancellation"])),{},{salesPaymentCollectionRequest:function(){var t=this;this.isLoading=!0,this.find({id:this.id,params:{with_archives:!0,with_origin:!0,includes:"form;customer;details;details.chartOfAccount;details.chartOfAccount.type;details.allocation;form.createdBy;form.requestApprovalTo;form.branch"}}).then((function(e){t.total_other=0,t.total_invoice=0,t.total_return=0,t.total_down_payment=0,t.details.salesInvoice=[],t.details.salesDownPayment=[],t.details.other=[],e.data.details.forEach((function(e){e.chart_of_account_id?(t.details.other.push(e),1===e.chart_of_account.type.is_debit?t.total_other-=parseFloat(e.amount):t.total_other+=parseFloat(e.amount)):"SalesInvoice"===e.referenceable_type?(t.details.salesInvoice.push(e),t.total_invoice+=parseFloat(e.amount)):"SalesDownPayment"===e.referenceable_type?(t.details.salesDownPayment.push(e),t.total_down_payment+=parseFloat(e.amount)):"SalesReturn"===e.referenceable_type&&(t.details.salesReturn.push(e),t.total_return+=parseFloat(e.amount))}))})).catch((function(e){t.$notification.error(e.message)})).finally((function(){t.isLoading=!1}))},onDelete:function(t){var e=this;this.isDeleting=!0,this.delete({id:this.id,data:{reason:t}}).then((function(t){e.isDeleting=!1,e.$notification.success("cancel success"),e.salesPaymentCollectionRequest(),e.sendCancellation({id:e.id,total_invoice:e.total_invoice,total_down_payment:e.total_down_payment,total_return:e.total_return,total_other:e.total_other}).catch((function(t){e.$notification.error(t.message),e.form.errors.record(t.errors)}))})).catch((function(t){e.isDeleting=!1,e.$notification.error(t.message),e.form.errors.record(t.errors)}))},onApprove:function(){var t=this;this.approve({id:this.id}).then((function(e){t.$notification.success("approve success"),t.salesPaymentCollectionRequest(),t.addHistories({id:e.data.id,activity:"Approved"}).catch((function(t){console.log(t.message)}))})).catch((function(e){t.$notification.error(e.message)}))},onReject:function(t){var e=this;t||this.$notification.error("reason cannot empty"),this.reject({id:this.id,reason:t}).then((function(t){e.$notification.success("reject success"),e.salesPaymentCollectionRequest(),e.addHistories({id:t.data.id,activity:"Rejected"}).catch((function(t){console.log(t.message)}))}))},onCancellationApprove:function(){var t=this;this.cancellationApprove({id:this.id}).then((function(e){t.$notification.success("cancellation approved"),t.$router.push("/sales/payment-collection"),t.addHistories({id:e.data.id,activity:"Cancelation Approved"}).catch((function(t){console.log(t.message)}))}))},onCancellationReject:function(t){var e=this;t||this.$notification.error("reason cannot empty"),this.cancellationReject({id:this.id,reason:t}).then((function(t){e.$notification.success("cancellation rejected"),e.salesPaymentCollectionRequest(),e.addHistories({id:t.data.id,activity:"Cancelation Rejected"}).catch((function(t){console.log(t.message)}))})).catch((function(t){console.log(t.message)}))}})},x=P,D=Object(y["a"])(x,s,o,!1,null,null,null);e["default"]=D.exports},f712:function(t,e,a){}}]);
//# sourceMappingURL=chunk-2b3db0cc.5bb5a63a.js.map