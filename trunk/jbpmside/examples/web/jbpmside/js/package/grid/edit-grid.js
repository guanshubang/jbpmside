/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */


Ext.grid.EditorGrid=function(_1,_2){Ext.grid.EditorGrid.superclass.constructor.call(this,_1,_2);this.getGridEl().addClass("xedit-grid");if(!this.selModel){this.selModel=new Ext.grid.CellSelectionModel();}this.activeEditor=null;this.addEvents({"beforeedit":true,"afteredit":true,"validateedit":true});this.on("bodyscroll",this.stopEditing,this);this.on(this.clicksToEdit==1?"cellclick":"celldblclick",this.onCellDblClick,this);};Ext.extend(Ext.grid.EditorGrid,Ext.grid.Grid,{isEditor:true,clicksToEdit:2,trackMouseOver:false,onCellDblClick:function(g,_4,_5){this.startEditing(_4,_5);},onEditComplete:function(ed,_7,_8){this.editing=false;this.activeEditor=null;ed.un("specialkey",this.selModel.onEditorKey,this.selModel);if(String(_7)!=String(_8)){var r=ed.record;var _a=this.colModel.getDataIndex(ed.col);var e={grid:this,record:r,field:_a,originalValue:_8,value:_7,row:ed.row,column:ed.col,cancel:false};if(this.fireEvent("validateedit",e)!==false&&!e.cancel){r.set(_a,e.value);delete e.cancel;this.fireEvent("afteredit",e);}}this.view.focusCell(ed.row,ed.col);},startEditing:function(_c,_d){this.stopEditing();if(this.colModel.isCellEditable(_d,_c)){this.view.ensureVisible(_c,_d,true);var r=this.dataSource.getAt(_c);var _f=this.colModel.getDataIndex(_d);var e={grid:this,record:r,field:_f,value:r.data[_f],row:_c,column:_d,cancel:false};if(this.fireEvent("beforeedit",e)!==false&&!e.cancel){this.editing=true;var ed=this.colModel.getCellEditor(_d,_c);if(!ed.rendered){ed.render(ed.parentEl||document.body);}(function(){ed.row=_c;ed.col=_d;ed.record=r;ed.on("complete",this.onEditComplete,this,{single:true});ed.on("specialkey",this.selModel.onEditorKey,this.selModel);this.activeEditor=ed;var v=r.data[_f];ed.startEdit(this.view.getCell(_c,_d),v);}).defer(50,this);}}},stopEditing:function(){if(this.activeEditor){this.activeEditor.completeEdit();}this.activeEditor=null;}});

Ext.grid.GridEditor=function(_1,_2){Ext.grid.GridEditor.superclass.constructor.call(this,_1,_2);_1.monitorTab=false;};Ext.extend(Ext.grid.GridEditor,Ext.Editor,{alignment:"tl-tl",autoSize:"width",hideEl:false,cls:"x-small-editor x-grid-editor",shim:false,shadow:"frame"});

Ext.grid.PropertyRecord=Ext.data.Record.create([{name:"name",type:"string"},"value"]);Ext.grid.PropertyStore=function(_1,_2){this.grid=_1;this.store=new Ext.data.Store({recordType:Ext.grid.PropertyRecord});this.store.on("update",this.onUpdate,this);if(_2){this.setSource(_2);}Ext.grid.PropertyStore.superclass.constructor.call(this);};Ext.extend(Ext.grid.PropertyStore,Ext.util.Observable,{setSource:function(o){this.source=o;this.store.removeAll();var _4=[];for(var k in o){if(this.isEditableValue(o[k])){_4.push(new Ext.grid.PropertyRecord({name:k,value:o[k]},k));}}this.store.loadRecords({records:_4},{},true);},onUpdate:function(ds,_7,_8){if(_8==Ext.data.Record.EDIT){var v=_7.data["value"];var _a=_7.modified["value"];if(this.grid.fireEvent("beforepropertychange",this.source,_7.id,v,_a)!==false){this.source[_7.id]=v;_7.commit();this.grid.fireEvent("propertychange",this.source,_7.id,v,_a);}else{_7.reject();}}},getProperty:function(_b){return this.store.getAt(_b);},isEditableValue:function(_c){if(_c&&_c instanceof Date){return true;}else{if(typeof _c=="object"||typeof _c=="function"){return false;}}return true;},setValue:function(_d,_e){this.source[_d]=_e;this.store.getById(_d).set("value",_e);},getSource:function(){return this.source;}});Ext.grid.PropertyColumnModel=function(_f,_10){this.grid=_f;var g=Ext.grid;g.PropertyColumnModel.superclass.constructor.call(this,[{header:this.nameText,sortable:true,dataIndex:"name",id:"name"},{header:this.valueText,resizable:false,dataIndex:"value",id:"value"}]);this.store=_10;this.bselect=Ext.DomHelper.append(document.body,{tag:"select",style:"display:none",cls:"x-grid-editor",children:[{tag:"option",value:"true",html:"true"},{tag:"option",value:"false",html:"false"}]});Ext.id(this.bselect);var f=Ext.form;this.editors={"date":new g.GridEditor(new f.DateField({selectOnFocus:true})),"string":new g.GridEditor(new f.TextField({selectOnFocus:true})),"number":new g.GridEditor(new f.NumberField({selectOnFocus:true,style:"text-align:left;"})),"boolean":new g.GridEditor(new f.Field({el:this.bselect,selectOnFocus:true}))};this.renderCellDelegate=this.renderCell.createDelegate(this);this.renderPropDelegate=this.renderProp.createDelegate(this);};Ext.extend(Ext.grid.PropertyColumnModel,Ext.grid.ColumnModel,{nameText:"Name",valueText:"Value",dateFormat:"m/j/Y",renderDate:function(_13){return _13.dateFormat(this.dateFormat);},renderBool:function(_14){return _14?"true":"false";},isCellEditable:function(_15,_16){return _15==1;},getRenderer:function(col){return col==1?this.renderCellDelegate:this.renderPropDelegate;},renderProp:function(v){return this.getPropertyName(v);},renderCell:function(val){var rv=val;if(val instanceof Date){rv=this.renderDate(val);}else{if(typeof val=="boolean"){rv=this.renderBool(val);}}return Ext.util.Format.htmlEncode(rv);},getPropertyName:function(_1b){var pn=this.grid.propertyNames;return pn&&pn[_1b]?pn[_1b]:_1b;},getCellEditor:function(_1d,_1e){var p=this.store.getProperty(_1e);var n=p.data["name"],val=p.data["value"];if(this.grid.customEditors[n]){return this.grid.customEditors[n];}if(val instanceof Date){return this.editors["date"];}else{if(typeof val=="number"){return this.editors["number"];}else{if(typeof val=="boolean"){return this.editors["boolean"];}else{return this.editors["string"];}}}}});Ext.grid.PropertyGrid=function(_22,_23){_23=_23||{};var _24=new Ext.grid.PropertyStore(this);this.store=_24;var cm=new Ext.grid.PropertyColumnModel(this,_24);_24.store.sort("name","ASC");Ext.grid.PropertyGrid.superclass.constructor.call(this,_22,Ext.apply({ds:_24.store,cm:cm,enableColLock:false,enableColumnMove:false,stripeRows:false,trackMouseOver:false,clicksToEdit:1},_23));this.getGridEl().addClass("x-props-grid");this.lastEditRow=null;this.on("columnresize",this.onColumnResize,this);this.addEvents({beforepropertychange:true,propertychange:true});this.customEditors=this.customEditors||{};};Ext.extend(Ext.grid.PropertyGrid,Ext.grid.EditorGrid,{render:function(){Ext.grid.PropertyGrid.superclass.render.call(this);this.autoSize.defer(100,this);},autoSize:function(){Ext.grid.PropertyGrid.superclass.autoSize.call(this);if(this.view){this.view.fitColumns();}},onColumnResize:function(){this.colModel.setColumnWidth(1,this.container.getWidth(true)-this.colModel.getColumnWidth(0));this.autoSize();},setSource:function(_26){this.store.setSource(_26);},getSource:function(){return this.store.getSource();}});
