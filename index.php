<?php
// ----------------------------------------------------------
// Set Page Defaults
// ----------------------------------------------------------

$page = isset($_GET["page"]) ? $_GET["page"] : 'blank';
$page = ($page != "banded") ? 'blank' : 'banded'; // just make site work with blank and banded for now

// Template Nodes : short-term solution to get the templates to work by hard-coding the number of page nodes within the template
// A longer-term (better) solution would be to read those templates in dynamically using the templating solution to precompile the pages
$num_nodes = 0; // initialize
switch ($page) {
  case 'blank':
    $num_nodes = 3;
    break;
  case 'banded':
    $num_nodes = 43;
    break;
  case 'contact':
    $num_nodes = 10;
    break;
  case 'feed':
    $num_nodes = 10;
    break;
  case 'grid':
    $num_nodes = 10;
    break;
  case 'orbit':
    $num_nodes = 10;
    break;
  case 'sidebar':
    $num_nodes = 10;
    break;
}

// ----------------------------------------------------------
// HTML Rendering
// ----------------------------------------------------------
?>
<!DOCTYPE html>

<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8" />
  <!-- Set the viewport width to device width for mobile -->
  <meta name="viewport" content="width=device-width" />

  <title>Build | Make Foundation 3 Websites Fast</title>
  
  <!-- Included CSS Files (Uncompressed) -->
  <!--
  <link rel="stylesheet" href="stylesheets/foundation.css">
  -->
  
  <!-- Included CSS Files (Compressed) -->
  <link rel="stylesheet" href="stylesheets/foundation.min.css">
  <link rel="stylesheet" href="stylesheets/app.css">
  <link rel="stylesheet" href="http://code.jquery.com/ui/1.9.1/themes/base/jquery-ui.css">

  <script src="javascripts/modernizr.foundation.js"></script>

  <!-- IE Fix for HTML5 Tags -->
  <!--[if lt IE 9]>
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>

<body class="test">
<div class="top-bar platform home">
  <div class="attached">
    <div onclick="void(0);" class="name">
      <a class="home" href="/">ZURBapps</a>
      <ul class="dropdown">
          <li><a href="http://www.influenceapp.com">Influence <small>Design Presentation</small></a></li>
          <li><a href="http://verifyapp.com/plans">Verify <small>Concept Testing</small></a></li>
          <li><a href="http://www.solidifyapp.com">Solidify <small>Prototype Testing</small></a></li>
          <li><a href="http:/www.notableapp.com">Notable <small>Interface Feedback</small></a></li>
          <li><a href="">Build <small>Foundation Pages</small></a></li>
      </ul>
    </div>
    <ul class="left">
        <li class="drop_menu new_page">
            <a href="/index.php">+ Build a Page</a>
            <ul class="dropdown">
                <li><a href="?page=blank">Blank Page</a></li>
                <!-- <li><a href="?page=templated">Templated</a></li>
                <li><a href="?page=components">Components</a></li> -->
                <li><a href="?page=banded">Banded</a></li>
                <!-- <li><a href="?page=banner">Banner</a></li>
                <li><a href="?page=contact">Contact</a></li>
                <li><a href="?page=feed">Feed</a></li>
                <li><a href="?page=grid">Grid</a></li>
                <li><a href="?page=orbit">Orbit</a></li>
                <li><a href="?page=sidebar">Sidebar</a></li> -->
            </ul>
        </li>
        <li class="drop_menu settings">
            <a href="">Settings</a>
            <ul class="dropdown">
                <li><a href="#" id="toggle_navigation" class="on">Arrow Navigation <span class="value">ON</span></a></li>
            </ul>
        </li>
    </ul>
    <div class="right">
        <ul class="device_picker">
            <li><a href="#" class="size" data-size="phone"><img src="images/build/phone_icon.png"></a></li>
            <li><a href="#" class="size" data-size="tablet"><img src="images/build/tablet_icon.png"></a></li>
            <li><a href="#" class="size selected" data-size="laptop"><img src="images/build/laptop_icon.png"></a></li>
            <li><a href="#" class="size" data-size="desktop"><img src="images/build/desktop_icon.png"></a></li>
        </ul>
        <a href="" class="small button">Grab the Code &raquo;</a>
    </div>
  </div>
</div>

<div class="composer">
  <h5>Code Composer</h5>
  <span id="tree_actions" style="display: none">
    <a id="action_delete" href="#" class="tiny secondary button"><b style="text-decoration: underline">x</b></a>
    <div href="#" class="tiny primary button split dropdown">
      <a class="insert_node" data-insert-method="prepend" href="#">insert</a>
      <span></span>
      <ul>
        <li><a class="insert_node" data-insert-method="before" href="#">before</a></li>
        <li><a class="insert_node" data-insert-method="prepend" href="#">&nbsp;&nbsp;&nbsp;first child</a></li>
        <li><a class="insert_node" data-insert-method="append" href="#">&nbsp;&nbsp;&nbsp;last child</a></li>
        <li><a class="insert_node" data-insert-method="after" href="#">after</a></li>
      </ul>
    </div>
  </span>
  <span id="tree_component" data-template="row" class="hide"><span>|
    <span class="action_buttons">
      <div href="#" class="tiny primary button dropdown">
        Component
        <ul>
          <li><a href="#"><b>ii</b> insert inside</a></li>
          <li><a href="#"><b>ib</b> insert before</a></li>
        </ul>
      </div>
    </span></span>
  </span>
  <div class="toolbar_buttons">
    <a href="#" id="view_switcher" class="insert small secondary button view_key">Key</a>
    <a href="#" id="insert_body" class="insert small secondary button"><span class="shortcut">I</span>nsert</a>
  </div>
  <ul id="tree">
    <?php if ($page == "banded") include 'banded_tree.html'; ?>
  </ul>
  <div id="key" class="hide">
    <h6>Keyboard Shortcuts</h6>
    <table>
      <tr class="title">
        <td colspan="2">Navigation</td>
      </tr>
      <tr>
        <td>Navigate up in tree</td>
        <td class="glyph">&uarr;</td>
      </tr>
      <tr>
        <td>Navigate down in tree</td>
        <td class="glyph">&darr;</td>
      </tr>
      <tr>
        <td>Toggle on / off</td>
        <td>a</td>
      </tr>
      <tr class="title">
        <td colspan="2">Insertion, Deletion</td>
      </tr>
      <tr>
        <td>Insert into page body (<em>shift-i</em>)</td>
        <td>I</td>
      </tr>
      <tr>
        <td>Insert into (first child)</td>
        <td>&lt;</td>
      </tr>
      <tr>
        <td>Insert into (last child)</td>
        <td>&gt;</td>
      </tr>
      <tr>
        <td>Insert before selection</td>
        <td>,</td>
      </tr>
      <tr>
        <td>insert after selection</td>
        <td>.</td>
      </tr>
      <tr>
        <td>Delete current selection</td>
        <td>x</td>
      </tr>
      <tr class="title">
        <td colspan="2">Scaffolding</td>
      </tr>
      <tr>
        <td>Row</td>
        <td>r</td>
      </tr>
      <tr>
        <td>1 Column<br></td>
        <td>1c</td>
      </tr>
      <tr>
        <td>2 Columns<br></td>
        <td>2c</td>
      </tr>
      <tr>
        <td>4 Columns<br></td>
        <td>4c</td>
      </tr>
      <tr>
        <td>6 Columns<br></td>
        <td>6c</td>
      </tr>
      <tr>
        <td>8 Columns<br></td>
        <td>8c</td>
      </tr>
      <tr>
        <td>12 Columns<br></td>
        <td>12c</td>
      </tr>
      <tr>
        <td>n Columns<br></td>
        <td>nc</td>
      </tr>
      <tr class="title">
        <td colspan="2">Elements</td>
      </tr>
      <tr>
        <td>Anchor</td>
        <td>a</td>
      </tr>
      <tr>
        <td>Paragraph</td>
        <td>p</td>
      </tr>
      <tr>
        <td>Heading 1<br></td>
        <td>h1</td>
      </tr>
      <tr>
        <td>Heading 2<br></td>
        <td>h2</td>
      </tr>
      <tr>
        <td>Heading 3<br></td>
        <td>h3</td>
      </tr>
      <tr>
        <td>Heading 4<br></td>
        <td>h4</td>
      </tr>
      <tr>
        <td>Heading 5<br></td>
        <td>h5</td>
      </tr>
      <tr>
        <td>Heading 6<br></td>
        <td>h6</td>
      </tr>
      <tr class="title">
        <td colspan="2">More coming soon...</td>
      </tr>
    </table>
  </div>
</div>

<div class="page_wrapper laptop" id="page_wrapper">
    <iframe id="page_frame" class="page_frame opaque" scrolling="no" src="<?php echo $page ?>.html"></iframe>
</div>

<!-- Included JS Files (Uncompressed) -->
<!--
<script src="javascripts/jquery.js"></script>
<script src="javascripts/jquery.foundation.mediaQueryToggle.js"></script>
<script src="javascripts/jquery.foundation.forms.js"></script>
<script src="javascripts/jquery.foundation.reveal.js"></script>
<script src="javascripts/jquery.foundation.orbit.js"></script>
<script src="javascripts/jquery.foundation.navigation.js"></script>
<script src="javascripts/jquery.foundation.buttons.js"></script>
<script src="javascripts/jquery.foundation.tabs.js"></script>
<script src="javascripts/jquery.foundation.tooltips.js"></script>
<script src="javascripts/jquery.foundation.accordion.js"></script>
<script src="javascripts/jquery.placeholder.js"></script>
<script src="javascripts/jquery.foundation.alerts.js"></script>
<script src="javascripts/jquery.foundation.topbar.js"></script>
<script src="javascripts/handlebars-1.0.rc.1.js"></script>
<script src="javascripts/underscore.js"></script>
-->

<!-- Included JS Files (Compressed) -->
<script src="javascripts/foundation.min.js"></script>
<script src="http://code.jquery.com/ui/1.9.1/jquery-ui.js"></script>
<script src="javascripts/handlebars-1.0.rc.1.min.js"></script>
<script src="javascripts/underscore.min.js"></script>

<!-- Initialize JS Plugins -->
<script type="text/javascript">
  window.num_nodes = <?php echo $num_nodes; ?>;
</script>
<script src="javascripts/app.js"></script>
<script src="javascripts/build_app.js"></script>
<script src="javascripts/autocomplete.js"></script>

<?php include 'templates.html'; ?>

</body>
</html>