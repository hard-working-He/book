from pathlib import Path
import subprocess
import textwrap


ROOT = Path("/Users/admin/go/bookstore-system")
DOCS_DIR = ROOT / "docs"
DOCS_DIR.mkdir(exist_ok=True)

html_path = DOCS_DIR / "基于Next.js的全栈网上书店管理系统论文初稿.html"
docx_path = DOCS_DIR / "基于Next.js的全栈网上书店管理系统论文初稿.docx"


html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>基于Next.js的全栈网上书店管理系统论文初稿</title>
  <style>
    body {
      font-family: "Songti SC", "SimSun", serif;
      font-size: 12pt;
      line-height: 1.8;
      margin: 2.5cm;
      color: #111;
    }
    h1, h2, h3, h4 {
      font-family: "SimHei", "Heiti SC", sans-serif;
      font-weight: 700;
      page-break-after: avoid;
    }
    h1 {
      font-size: 18pt;
      text-align: center;
      margin: 20pt 0 16pt;
    }
    h2 {
      font-size: 16pt;
      text-align: center;
      margin: 18pt 0 14pt;
    }
    h3 {
      font-size: 15pt;
      margin: 16pt 0 10pt;
    }
    h4 {
      font-size: 14pt;
      margin: 12pt 0 8pt;
    }
    p {
      text-indent: 2em;
      margin: 0 0 10pt;
      text-align: justify;
    }
    .center { text-align: center; text-indent: 0; }
    .noindent { text-indent: 0; }
    .cover-title {
      font-size: 22pt;
      font-weight: 700;
      text-align: center;
      margin-top: 48pt;
      margin-bottom: 40pt;
      font-family: "SimHei", "Heiti SC", sans-serif;
    }
    .paper-title {
      font-size: 20pt;
      font-weight: 700;
      text-align: center;
      margin: 60pt 0 48pt;
      text-decoration: underline;
      font-family: "SimHei", "Heiti SC", sans-serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0 18pt;
      font-size: 11pt;
    }
    td, th {
      border: 1px solid #333;
      padding: 6pt 8pt;
      vertical-align: top;
    }
    .cover-table td, .cover-table th {
      border: none;
      padding: 8pt 4pt;
      font-size: 14pt;
    }
    .toc p {
      text-indent: 0;
      margin: 0 0 6pt;
    }
    .pagebreak {
      page-break-before: always;
    }
    ul {
      margin-top: 0;
      margin-bottom: 10pt;
    }
    li {
      margin-bottom: 6pt;
    }
  </style>
</head>
<body>
  <div class="cover-title">本科毕业论文（设计）</div>
  <div class="paper-title">基于Next.js的全栈网上书店管理系统的设计与实现</div>
  <table class="cover-table">
    <tr><td style="width:28%">学部（学院）</td><td>计算机科学与技术学部</td></tr>
    <tr><td>专业班级</td><td>计算机科学与技术 计科22-2</td></tr>
    <tr><td>学生姓名</td><td>郗鸣</td></tr>
    <tr><td>学号</td><td>202203010050</td></tr>
    <tr><td>导师姓名</td><td>吕国华　周策</td></tr>
  </table>
  <p class="center" style="margin-top:72pt;">2026 年 4 月 24 日</p>

  <div class="pagebreak"></div>
  <h1>齐鲁工业大学本科毕业论文（设计）原创性声明</h1>
  <p>本人郑重声明：所呈交的毕业论文（设计），是本人在指导教师的指导下独立完成的研究成果。除文中已经注明引用的内容外，本论文不包含任何其他个人或集体已经发表或撰写过的研究成果，也不包含为获得齐鲁工业大学或其他教育机构的学位或证书而使用过的材料。对本文研究做出重要贡献的个人和集体，均已在文中作了明确说明并表示谢意。本人完全意识到本声明的法律后果由本人承担。</p>
  <p class="noindent" style="margin-top:24pt;">毕业论文（设计）作者签名：_______________</p>
  <p class="noindent">日　　　　　　期：_______________</p>

  <h1 style="margin-top:48pt;">齐鲁工业大学本科毕业论文（设计）使用授权说明</h1>
  <p>本人完全了解学校关于保存、使用毕业论文（设计）的有关规定，同意学校保留并向有关部门或机构送交论文（设计）的复印件和电子文档，允许论文（设计）被查阅和借阅；本人授权齐鲁工业大学可以将本论文（设计）的全部或部分内容编入有关数据库进行检索，也可以采用影印、缩印、扫描或其他复制手段保存、汇编论文（设计）。</p>
  <p class="noindent" style="margin-top:24pt;">指导教师签名：_______________</p>
  <p class="noindent">毕业论文（设计）作者签名：_______________</p>
  <p class="noindent">日　　　　　　期：_______________</p>

  <div class="pagebreak"></div>
  <h1>目　　录</h1>
  <div class="toc">
    <p>摘　　要</p>
    <p>ABSTRACT</p>
    <p>第1章 绪论</p>
    <p>第2章 系统需求分析</p>
    <p>第3章 系统总体设计</p>
    <p>第4章 系统详细实现</p>
    <p>第5章 系统测试与分析</p>
    <p>第6章 总结与展望</p>
    <p>参考文献</p>
    <p>致　　谢</p>
    <p>附　　录</p>
  </div>

  <div class="pagebreak"></div>
  <h1>摘　　要</h1>
  <p>随着电子商务平台和移动互联网的持续发展，线上图书销售逐渐成为读者获取图书的重要渠道。传统书店系统往往存在前后端分离成本较高、功能模块耦合度大、维护效率低等问题，而基于现代全栈框架构建的网上书店系统能够在统一技术栈下同时实现用户购书体验优化与后台管理效率提升。为此，本文围绕“基于Next.js的全栈网上书店管理系统”展开研究与实现，完成了一个覆盖用户端和管理员端业务流程的书店平台原型。</p>
  <p>本系统采用Next.js 14 作为全栈开发框架，结合React 18实现组件化界面渲染，利用App Router与Route Handlers完成页面与接口的一体化组织；状态管理层采用Redux Toolkit维护用户信息与购物车数据；数据持久化层采用MySQL数据库，借助Prisma实现类型安全的数据访问；在安全机制方面，引入JWT认证、CSRF Token校验、内容安全策略和输入清洗等手段，以提升系统的可靠性与安全性。围绕业务需求，系统实现了用户注册登录、图书分类浏览、关键字搜索、图书详情展示、购物车管理、在线下单、历史订单查询、地址管理，以及管理员后台的图书维护、库存与价格调整、订单状态更新、用户查看和销售统计等功能。</p>
  <p>在实现过程中，本文完成了系统需求分析、功能结构设计、数据库模型设计、前后端模块实现与运行测试，并在本地真实MySQL环境中完成数据库初始化、种子数据导入及系统启动验证。测试结果表明，该系统能够较为完整地支撑网上书店的核心业务场景，页面交互流畅，模块结构清晰，便于后续扩展支付接入、推荐算法优化和生产环境部署。研究结果说明，基于Next.js的全栈开发模式能够在保证开发效率的同时提升系统的一致性与可维护性，对电子商务类Web系统的课程实践和工程训练具有较高参考价值。</p>
  <p class="noindent"><strong>关键词：</strong>Next.js；网上书店；全栈开发；MySQL；Prisma；电子商务系统</p>

  <div class="pagebreak"></div>
  <h1>ABSTRACT</h1>
  <p class="noindent">With the rapid growth of e-commerce and web application technologies, online bookstores have become an important channel for readers to search, purchase, and manage books. Compared with traditional monolithic or loosely integrated bookstore systems, a full-stack architecture based on modern React frameworks can improve development efficiency, interaction consistency, and maintainability. Therefore, this paper designs and implements a full-stack online bookstore management system based on Next.js, covering both customer-oriented functions and administrator-oriented management functions.</p>
  <p class="noindent">The system is built with Next.js 14 and React 18. The App Router and Route Handlers are adopted to organize pages and RESTful APIs in a unified framework. Redux Toolkit is used for global state management, especially for user state and shopping cart state. MySQL is selected as the core relational database, and Prisma ORM is employed to provide type-safe data access and schema management. To enhance system security, the project introduces JWT-based authentication, CSRF token validation, content security policy, and input sanitization. The implemented business functions include user registration and login, book classification and search, book detail display, related recommendation, shopping cart management, order submission, order history query, profile and address maintenance, as well as administrator-side book management, stock adjustment, order processing, user management, and sales statistics.</p>
  <p class="noindent">This paper further presents requirement analysis, architecture design, database design, key module implementation, and system testing. The project has been initialized and verified in a real MySQL environment, demonstrating that the developed system can support the core workflow of an online bookstore with clear structure, responsive interaction, and good extensibility. The study shows that Next.js-based full-stack development is suitable for practical training and engineering-oriented web application construction.</p>
  <p class="noindent"><strong>Key words:</strong> Next.js; online bookstore; full-stack development; MySQL; Prisma; e-commerce system</p>

  <div class="pagebreak"></div>
  <h1>第1章 绪论</h1>
  <h3>1.1 课题研究背景</h3>
  <p>随着互联网基础设施不断完善，网络购物已经从单一的商品交易渠道发展为融合搜索、推荐、支付、评价与数据分析的综合服务平台。图书作为知识传播的重要媒介，其销售场景在数字化进程中表现得尤为明显。一方面，线上书店能够突破实体门店的时间和空间限制，为用户提供更丰富的图书选择；另一方面，平台化系统还能通过分类、检索、相关推荐、订单跟踪等功能显著提升购书效率。对于高校软件工程实践而言，网上书店管理系统具备典型的电子商务流程和明确的角色边界，适合作为全栈Web应用的综合训练课题。</p>
  <h3>1.2 国内外研究与技术发展现状</h3>
  <p>当前主流电商平台通常采用前后端协作的分层架构，同时在页面渲染、缓存优化和数据安全等方面引入现代化框架与工程化手段。React在组件化开发中已形成成熟生态，而Next.js在React基础上进一步整合了路由、服务端渲染、数据获取、Server Components和部署能力，使开发者能够在统一框架中完成前端页面与后端接口开发。相较于传统多仓库分离式方案，这种模式更适合中小型教学项目和快速迭代型业务系统。与此同时，MySQL、Prisma、JWT 与 OWASP 安全实践也为系统的数据管理和访问控制提供了可靠基础。</p>
  <h3>1.3 课题研究目的与意义</h3>
  <p>本课题旨在设计并实现一个基于Next.js的全栈网上书店管理系统，通过将用户端购书流程与管理员后台流程整合在同一项目中，验证现代全栈框架在电子商务类系统中的适用性。理论意义在于梳理Next.js全栈架构、React组件化开发、关系型数据库建模及Web安全机制之间的协同关系；实践意义在于通过完整的工程实现，提升对需求分析、模块设计、数据库设计、接口开发、系统调试与项目运行维护的综合能力。</p>
  <h3>1.4 研究内容与论文结构</h3>
  <p>围绕项目目标，本文主要完成以下内容：第一，结合网上书店业务场景进行需求分析，明确用户端与管理员端的功能边界；第二，完成系统总体架构、数据库实体关系和关键业务流程设计；第三，基于Next.js、React、Redux Toolkit、Prisma和MySQL实现系统核心模块；第四，对系统进行运行验证和功能测试，分析当前实现效果及后续优化方向。全文共分为六章：第1章介绍研究背景与意义；第2章分析系统需求；第3章阐述总体设计；第4章说明详细实现；第5章给出测试与分析；第6章总结全文并展望未来工作。</p>

  <div class="pagebreak"></div>
  <h1>第2章 系统需求分析</h1>
  <h3>2.1 业务角色分析</h3>
  <p>本系统包含两类核心角色：普通用户与管理员。普通用户关注的是购书流程的完整性与操作便捷性，需要通过注册、登录、浏览、搜索、加入购物车、提交订单和查询历史订单等功能完成线上购买行为。管理员则关注平台运营，需要通过后台系统完成图书维护、库存调整、订单处理、用户查看和数据统计等管理工作。由于两类角色的业务目标不同，系统必须在权限控制、界面布局和接口访问上进行明确区分。</p>
  <h3>2.2 功能需求分析</h3>
  <p>从用户端来看，系统应支持注册登录、身份认证、图书分类展示、关键字检索、图书详情查看、相关推荐、购物车管理、地址维护、在线下单与订单状态查询等功能。其中，购物车与下单流程是系统的核心交易链路，需要保证库存校验、订单金额计算和订单记录持久化的正确性。从管理员端来看，系统应提供后台登录入口、图书新增与编辑、上下架管理、价格与库存维护、订单状态更新、用户列表查看以及销售统计展示等功能，以满足书店平台的日常运营需求。</p>
  <h3>2.3 非功能需求分析</h3>
  <p>除功能需求外，系统还需要满足若干非功能性指标。第一，在可用性方面，页面应具备清晰的导航结构，能够在PC端和移动端正常显示。第二，在性能方面，系统应通过服务端渲染、合理的数据分页和必要的缓存手段降低首屏加载成本。第三，在安全性方面，系统应具备身份认证、权限校验、CSRF防护、XSS防护和Cookie安全属性设置等机制。第四，在可维护性方面，项目应采用模块化目录结构，使页面、组件、状态、接口和数据库模型分层清晰，方便后期扩展。</p>
  <h3>2.4 可行性分析</h3>
  <p>从技术可行性角度看，Next.js 14 提供了较成熟的App Router、服务端组件与Route Handlers能力，能够同时满足页面构建和业务接口开发需求；Prisma 与 MySQL 的组合有利于快速完成关系模型设计和数据访问；Redux Toolkit 则能够较低成本地维护全局状态。从经济可行性和实现可行性角度看，本系统采用的技术栈均为开源或免费可用工具，适合在课程设计和毕业设计周期内完成，具备较高的工程落地可行性。</p>
  <h3>2.5 用例与业务流程说明</h3>
  <p>系统的关键业务流程可以概括为“用户登录—浏览图书—加入购物车—填写地址—提交订单—后台处理订单—用户查询订单状态”。在这一流程中，用户操作会触发多个服务端校验步骤，包括身份验证、图书有效性校验、库存校验、地址归属校验和订单生成事务处理等；管理员则在订单处理环节负责将订单状态从已支付逐步更新为已发货、已完成等状态。这种基于角色协同的流程是网上书店系统的核心场景，也是本文实现与测试的重点内容。</p>

  <div class="pagebreak"></div>
  <h1>第3章 系统总体设计</h1>
  <h3>3.1 系统总体架构设计</h3>
  <p>本系统采用基于Next.js的全栈一体化架构。表示层由App Router下的页面与可复用组件构成，其中用户端包含首页、登录页、注册页、图书详情页、购物车页、结算页、订单页和个人中心页，管理员端包含控制台、图书管理页、订单管理页和用户管理页。业务层通过Route Handlers实现RESTful风格接口，负责用户认证、图书查询、购物车维护、订单创建、地址管理和后台管理逻辑。数据层由Prisma和MySQL组成，负责实体映射、关系维护与持久化操作。这样的架构既降低了前后端联调成本，也保证了页面渲染与数据访问的一致性。</p>
  <h3>3.2 功能模块设计</h3>
  <p>根据需求分析结果，系统可划分为前台用户模块、后台管理模块、认证安全模块和数据持久化模块四大部分。前台用户模块实现用户购书全过程；后台管理模块实现运营维护；认证安全模块负责JWT签发、Cookie写入、权限校验与CSRF检查；数据持久化模块负责数据库访问与事务处理。模块划分遵循“高内聚、低耦合”的设计原则，不同模块之间通过接口契约交互，方便后续功能扩展与重构。</p>

  <h3>3.3 数据库设计</h3>
  <p>系统数据库采用MySQL实现，结合Prisma Schema定义实体模型。根据业务流程，共设计了用户表、地址表、图书表、购物车表、订单表和订单明细表等核心数据表。各数据表之间通过主键和外键关系形成完整的数据链路，例如用户与地址是一对多关系，用户与订单是一对多关系，订单与订单明细是一对多关系，图书与购物车、订单明细之间则形成业务关联。</p>
  <table>
    <tr>
      <th>表名</th>
      <th>主要字段</th>
      <th>作用说明</th>
    </tr>
    <tr>
      <td>User</td>
      <td>id、name、email、password、role、avatarUrl</td>
      <td>存储用户基础信息与角色信息</td>
    </tr>
    <tr>
      <td>Address</td>
      <td>userId、receiver、phone、province、city、detail、isDefault</td>
      <td>维护用户收货地址数据</td>
    </tr>
    <tr>
      <td>Book</td>
      <td>title、author、category、price、stock、status、coverUrl</td>
      <td>存储图书信息、库存和上架状态</td>
    </tr>
    <tr>
      <td>CartItem</td>
      <td>userId、bookId、quantity</td>
      <td>记录用户购物车中的图书项</td>
    </tr>
    <tr>
      <td>Order</td>
      <td>orderNo、userId、totalAmount、status、paymentMethod</td>
      <td>记录订单主信息和支付状态</td>
    </tr>
    <tr>
      <td>OrderItem</td>
      <td>orderId、bookId、titleSnapshot、priceSnapshot、quantity</td>
      <td>保存下单时的图书快照与购买数量</td>
    </tr>
  </table>

  <h3>3.4 权限与安全设计</h3>
  <p>系统在认证层采用基于JWT的身份校验方案。用户登录后，服务端签发包含用户ID、角色、邮箱和姓名的令牌，并通过HttpOnly Cookie下发到浏览器；在后续请求中，服务端解析令牌并完成身份识别。为防范越权访问，系统分别提供“当前用户校验”和“当前管理员校验”逻辑，对前台与后台资源进行权限隔离。为降低跨站请求伪造风险，系统在中间件中写入CSRF Cookie，并要求状态变更类请求携带对应请求头；为降低XSS风险，系统采用输入清洗、React默认转义和CSP响应头的组合方案。此外，系统还设置了X-Frame-Options、X-Content-Type-Options、Referrer-Policy等安全响应头。</p>
  <h3>3.5 关键业务流程设计</h3>
  <p>在订单提交流程中，系统先根据当前登录用户获取购物车项与地址信息，再对地址合法性和图书库存进行校验。若校验通过，系统在事务中创建订单主表记录、写入订单明细、扣减库存并增加销量，最后清空购物车，保证数据更新的一致性与原子性。该设计避免了订单创建成功但库存未同步、购物车未清空等数据不一致问题，是系统总体设计中的关键环节。</p>

  <div class="pagebreak"></div>
  <h1>第4章 系统详细实现</h1>
  <h3>4.1 项目目录与工程组织实现</h3>
  <p>项目采用Next.js 14 官方推荐的 App Router 目录结构。`app` 目录用于组织页面和 Route Handlers，其中 `(store)` 路由分组承载前台页面，`(admin)` 路由分组承载后台页面，`app/api` 用于定义接口路由；`components` 目录按 `layout`、`store`、`admin` 和 `shared` 进行拆分，实现不同场景下的界面复用；`lib` 目录封装认证、数据库连接、格式化、安全与上传等通用工具；`store` 目录维护Redux切片与类型定义；`prisma` 目录存放数据库模型与种子脚本。这样的组织方式有利于保持业务代码边界清晰。</p>

  <h3>4.2 用户端功能实现</h3>
  <p>用户端首页实现了图书分类筛选、关键字检索与分页展示，并通过服务端查询已发布图书列表以保证首屏内容可直接渲染。图书详情页根据图书ID拉取详细信息，并按照分类和销量返回相关推荐数据。购物车模块在客户端通过按钮触发加入、修改数量和删除操作，对应请求发送至 `/api/cart` 和 `/api/cart/[itemId]` 接口；用户在结算页面选择地址和支付方式后，系统调用 `/api/orders` 完成订单生成。个人中心则支持用户资料修改、头像地址维护及收货地址的新增、删除与默认地址设置，形成较完整的用户购书闭环。</p>

  <h3>4.3 管理员端功能实现</h3>
  <p>管理员端采用独立的 `/admin/login` 入口与后台布局。后台控制台通过统计接口汇总用户数、图书数、订单数和销售额，并展示最近订单列表。图书管理页面支持新增、编辑、删除图书，以及对价格、库存和状态进行维护；订单管理页面支持查看订单详情并以选择框形式更新订单状态；用户管理页面则显示用户角色、订单数和地址数等信息。由于管理员端和用户端共用同一套认证体系，因此在接口实现中，只需在现有身份校验基础上增加管理员角色检查即可完成后台访问控制。</p>

  <h3>4.4 状态管理与数据交互实现</h3>
  <p>系统使用Redux Toolkit维护用户登录状态和购物车计数状态。通过 `auth-slice` 存储当前用户对象，通过 `cart-slice` 记录购物车数量，并在全局 `Providers` 中进行注入。登录、退出登录、加入购物车等操作完成后，会同步更新全局状态，从而使头部导航等组件及时反映最新信息。与后端接口交互时，系统封装了统一的 `apiFetch` 方法，自动附带 `credentials` 与 CSRF 请求头，实现了前后端请求逻辑的一致封装。</p>

  <h3>4.5 数据库访问与业务事务实现</h3>
  <p>在数据访问层，系统通过Prisma Client进行数据库操作。相较于直接拼接SQL语句，Prisma能够提供更明确的类型推导和关系建模能力，降低字段错误和结构漂移带来的风险。以订单创建为例，系统采用事务接口统一完成订单主表写入、订单明细写入、图书库存扣减、销量增加和购物车清空等步骤，确保业务处理具备原子性。实际运行结果表明，该方案能够稳定支撑订单链路的数据一致性要求。</p>

  <h3>4.6 安全与上传功能实现</h3>
  <p>系统在中间件中统一设置CORS和安全响应头，并为首次访问用户写入CSRF Cookie。对于头像和图书封面上传，系统提供独立的上传接口，将文件保存到 `public/uploads` 目录中，并返回可直接访问的相对路径。虽然当前实现主要用于本地演示，但该接口设计已具备迁移到对象存储服务的基础。登录态采用HttpOnly Cookie存储JWT，降低了令牌被前端脚本直接读取的风险；同时，所有需要登录或管理员权限的接口都会在服务端进行二次校验，避免仅依赖前端路由控制造成安全漏洞。</p>

  <div class="pagebreak"></div>
  <h1>第5章 系统测试与分析</h1>
  <h3>5.1 测试环境</h3>
  <p>系统测试环境为macOS平台，Node.js版本为20.x，包管理工具为pnpm，数据库为本地MySQL 9.3兼容环境，开发框架为Next.js 14。测试过程中完成了数据库创建、Prisma结构推送、种子数据导入、开发服务器启动与页面访问验证，确保测试结果能够覆盖系统的主要运行链路。</p>

  <h3>5.2 功能测试</h3>
  <p>针对系统核心功能，本文从用户端和管理员端分别进行了流程验证。用户端重点测试注册登录、图书浏览、购物车增删改、地址维护、订单提交与订单查询；管理员端重点测试后台登录、图书管理、订单状态更新和统计页面展示。主要测试结果如表5-1所示。</p>
  <table>
    <tr>
      <th>测试编号</th>
      <th>测试内容</th>
      <th>预期结果</th>
      <th>测试结果</th>
    </tr>
    <tr>
      <td>T1</td>
      <td>用户使用已注册账号登录</td>
      <td>登录成功，首页显示用户名与购物车数量</td>
      <td>通过</td>
    </tr>
    <tr>
      <td>T2</td>
      <td>首页按分类和关键字搜索图书</td>
      <td>返回符合条件的图书列表并支持分页</td>
      <td>通过</td>
    </tr>
    <tr>
      <td>T3</td>
      <td>图书加入购物车并修改数量</td>
      <td>购物车数量与订单金额同步更新</td>
      <td>通过</td>
    </tr>
    <tr>
      <td>T4</td>
      <td>选择地址后提交订单</td>
      <td>订单生成成功，库存扣减，购物车清空</td>
      <td>通过</td>
    </tr>
    <tr>
      <td>T5</td>
      <td>管理员更新订单状态</td>
      <td>状态从已支付可更新为已发货、已完成等</td>
      <td>通过</td>
    </tr>
    <tr>
      <td>T6</td>
      <td>后台新增和编辑图书</td>
      <td>图书数据可写入数据库并在前台展示</td>
      <td>通过</td>
    </tr>
  </table>

  <h3>5.3 运行结果分析</h3>
  <p>测试结果表明，系统目前已能够稳定支撑网上书店的主要业务流程。前台页面响应较为流畅，用户登录、购物车操作和订单提交流程能够正确触发数据库变更；后台系统可对图书和订单进行管理，统计页面也能汇总关键数据。在实际调试过程中，曾出现由于开发环境CSP策略设置过严导致登录页脚本未正常接管表单提交的问题，后续通过放宽开发环境下的 `script-src` 和本地连接源配置完成修复。该问题说明在引入安全响应头时，需要兼顾开发环境与生产环境的差异化策略。</p>

  <h3>5.4 系统不足与优化方向</h3>
  <p>作为毕业设计阶段的工程原型，系统仍存在进一步完善空间。首先，当前支付模块采用模拟支付，尚未接入真实第三方支付平台；其次，图书推荐功能主要基于同分类与销量排序，尚未引入用户行为建模和个性化算法；再次，系统测试主要以功能验证为主，缺乏更系统的自动化测试、压力测试和异常恢复测试。后续可进一步补充单元测试、接口测试与端到端测试体系，并针对缓存策略、图片资源、推荐逻辑和部署方案进行持续优化。</p>

  <div class="pagebreak"></div>
  <h1>第6章 总结与展望</h1>
  <p>本文围绕基于Next.js的全栈网上书店管理系统展开了需求分析、总体设计、详细实现与运行测试，完成了一个包含用户购书功能和管理员后台功能的完整Web系统原型。研究与实现结果表明，Next.js 14 提供的全栈开发能力能够有效支撑电子商务系统的页面渲染、接口开发与工程组织；React 18 与Redux Toolkit有助于提升界面复用效率和状态管理清晰度；Prisma 与MySQL的结合则使数据库建模和数据访问更加规范可靠。通过本课题的开发实践，可以较为系统地理解现代Web应用从需求分析到系统落地的全过程。</p>
  <p>未来工作可从三个方面进一步展开：一是业务能力扩展，如接入真实支付接口、订单退款流程、图书评价与收藏功能；二是算法与数据能力提升，如引入用户画像、协同过滤推荐和销售预测分析；三是工程能力增强，如容器化部署、日志监控、自动化测试和持续集成流水线建设。总体而言，本课题为后续开展更高完整度的电商平台研究与实现奠定了较好的基础。</p>

  <div class="pagebreak"></div>
  <h1>参考文献</h1>
  <p class="noindent">[1] Vercel. Next.js Docs[EB/OL]. https://nextjs.org/docs, 2026-04-24.</p>
  <p class="noindent">[2] Vercel. App Router | Next.js[EB/OL]. https://nextjs.org/docs/app, 2026-04-24.</p>
  <p class="noindent">[3] Meta. Built-in React Hooks[EB/OL]. https://react.dev/reference/react/hooks, 2026-04-24.</p>
  <p class="noindent">[4] Redux Team. Getting Started with Redux Toolkit[EB/OL]. https://redux-toolkit.js.org/introduction/getting-started, 2026-04-24.</p>
  <p class="noindent">[5] Prisma Labs. Prisma ORM Overview[EB/OL]. https://docs.prisma.io/docs/orm, 2026-04-24.</p>
  <p class="noindent">[6] Prisma Labs. MySQL Database Connector[EB/OL]. https://www.prisma.io/docs/orm/core-concepts/supported-databases/mysql, 2026-04-24.</p>
  <p class="noindent">[7] Oracle. MySQL 8.0 Reference Manual[M/OL]. https://dev.mysql.com/doc/refman/8.0/en/manual-info.html, 2026-04-24.</p>
  <p class="noindent">[8] Fielding R T. Architectural Styles and the Design of Network-based Software Architectures[D]. Irvine: University of California, 2000.</p>
  <p class="noindent">[9] Jones M, Bradley J, Sakimura N. JSON Web Token (JWT)[S/OL]. RFC 7519, https://www.rfc-editor.org/rfc/rfc7519, 2026-04-24.</p>
  <p class="noindent">[10] OWASP Foundation. Cross-Site Request Forgery Prevention Cheat Sheet[EB/OL]. https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html, 2026-04-24.</p>
  <p class="noindent">[11] OWASP Foundation. Cross Site Scripting Prevention Cheat Sheet[EB/OL]. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html, 2026-04-24.</p>
  <p class="noindent">[12] 王珊, 萨师煊. 数据库系统概论[M]. 6版. 北京: 高等教育出版社, 2019.</p>

  <div class="pagebreak"></div>
  <h1>致　　谢</h1>
  <p>本论文从课题选题、系统分析、编码实现到运行测试的完成，离不开指导教师的耐心指导与帮助。在此，谨向吕国华老师、周策老师表示衷心感谢。两位老师在毕业设计期间对论文结构、系统功能划分、技术路线选择和工程实现细节提出了许多宝贵意见，使我能够更加系统地理解软件工程项目从需求到落地的完整过程。</p>
  <p>同时，感谢在大学阶段给予我帮助的任课教师与同学。课程学习中积累的程序设计、数据库原理、计算机网络、软件工程等知识，为本系统的实现奠定了理论基础。感谢同学们在项目调试、功能体验和论文修改过程中提出的建议，使本课题不断完善。最后，感谢家人一直以来的支持与鼓励，使我能够顺利完成本科阶段的学习与毕业设计工作。</p>

  <div class="pagebreak"></div>
  <h1>附　　录</h1>
  <h3>附录A 核心接口列表</h3>
  <table>
    <tr>
      <th>接口路径</th>
      <th>请求方式</th>
      <th>功能说明</th>
    </tr>
    <tr><td>/api/auth/register</td><td>POST</td><td>用户注册</td></tr>
    <tr><td>/api/auth/login</td><td>POST</td><td>用户或管理员登录</td></tr>
    <tr><td>/api/books</td><td>GET</td><td>获取图书列表与分页数据</td></tr>
    <tr><td>/api/books/[id]</td><td>GET</td><td>获取图书详情及相关推荐</td></tr>
    <tr><td>/api/cart</td><td>GET/POST</td><td>查询购物车与加入购物车</td></tr>
    <tr><td>/api/cart/[itemId]</td><td>PATCH/DELETE</td><td>修改购物车项数量或删除购物车项</td></tr>
    <tr><td>/api/orders</td><td>GET/POST</td><td>查询订单与提交订单</td></tr>
    <tr><td>/api/profile</td><td>PATCH</td><td>修改用户资料</td></tr>
    <tr><td>/api/addresses</td><td>POST</td><td>新增收货地址</td></tr>
    <tr><td>/api/admin/books</td><td>GET/POST</td><td>后台图书列表与新增图书</td></tr>
    <tr><td>/api/admin/orders/[id]</td><td>PATCH</td><td>后台更新订单状态</td></tr>
    <tr><td>/api/stats</td><td>GET</td><td>后台统计数据查询</td></tr>
  </table>

  <h3>附录B 系统运行说明</h3>
  <p>系统启动前需在项目根目录配置 `.env` 文件，主要包括 `DATABASE_URL`、`JWT_SECRET`、`APP_URL` 和 `APP_ORIGIN` 等参数。初始化流程为：首先执行 `pnpm db:push` 将Prisma模型同步至MySQL数据库；然后执行 `pnpm db:seed` 导入管理员、测试用户及图书样例数据；最后执行 `pnpm dev` 启动开发环境。默认测试账号为管理员 `admin@bookstore.com / Admin@123`，普通用户 `user@bookstore.com / User@123`。</p>
</body>
</html>
"""

html_path.write_text(textwrap.dedent(html), encoding="utf-8")

subprocess.run(
    [
        "textutil",
        "-convert",
        "docx",
        "-output",
        str(docx_path),
        str(html_path),
    ],
    check=True,
)

print(docx_path)
