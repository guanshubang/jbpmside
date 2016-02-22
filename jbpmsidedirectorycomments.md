# jBPM-side 1.0 目录结构 #

## jBPM-side 总体目录结构 ##

|**目录**  | **描述**|
|:-------|:------|
|bin     | 执行命令目录，此目录下：appserver，其中appserver放置应用服务器（tomcat5.5.20） |
|conf    | 放置jbpmside运行所需要的配置文件 |
|db      |内存数据库及其它数据库的脚本文件 |
|deploy  | 放置jbpmside的可独立部署的war包 |
|designer | 基于flex的流程设计器 |
|docs    | 文档目录。包含三个子目录：javadocs、devguide、userguide，其中javadocs放置jbpmside的javadoc，devguide放置jbpmside的开发手册，userguide放置用户使用手册|
|examples | 放置jbpmside的一个完整的应用示例 |
|lib     |放置jbpmside所依赖的所有第三方jar文件 |
|modules  |放置jbpmside的所有源代码 |