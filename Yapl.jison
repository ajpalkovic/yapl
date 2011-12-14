%lex
identPart (?![a-zA-Z_0-9])
esc "\\"
flag ([a-z])*
stringContentSingle (?:{esc}['bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^'{esc}])*
stringContentDouble (?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*

%%
\/\/[^\n]*  { /* Skip block comment */ }
\/\/.*?$    { /* Skip comment */ }
[^\S\n]+    { /* Skip Whitespace */ }
[\n]        { return 'NEWLINE'; }

[+-]?(?:((?:"0"[0-7]+))|((?:"0x"[a-fA-F0-9]+))|((?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE]\d+)?))  { return 'NUMERIC_LITERAL'; }
{flag}\'{stringContentSingle}\'   { return 'STRING_LITERAL'; }
{flag}\"{stringContentDouble}\"   { return 'STRING_LITERAL'; }

":"[_a-zA-Z0-9\$]+            { console.log(yytext); return 'SYMBOL'; }
":"\'{stringContentSingle}\'  { return 'SYMBOL'; }
":"\"{stringContentDouble}\"  { return 'SYMBOL'; }

\/(?:[^\/]|"\\/")*\/  { return 'REGEX'; }

"("     { return 'OPEN_PAREN'; }
")"     { return 'CLOSE_PAREN'; }
"["     { return 'OPEN_BRACKET'; }
"]"     { return 'CLOSE_BRACKET'; }
"{"     { return 'OPEN_BRACE'; }
"}"     { return 'CLOSE_BRACE'; }
"..."   { return 'ELLIPSES'; }
"."     { return 'DOT'; }
"++"    { return 'INCREMENT'; }
"+"     { return 'PLUS'; }
"--"    { return 'DECREMENT'; }
"-"     { return 'MINUS'; }
"*"     { return 'ASTERISK'; }
"/"     { return 'SLASH'; }
"%"     { return 'MODULUS'; }
"?"     { return 'QUESTION'; }
","     { return 'COMMA'; }
";"     { return 'SEMI'; }
":"     { return 'COLON'; }
"=="    { return 'EQUAL'; }
"*="    { return 'MUL_EQUALS'; }
"/="    { return 'DIV_EQUALS'; }
"%="    { return 'MOD_EQUALS'; }
"+="    { return 'PLUS_EQUALS'; }
"-="    { return 'MINUS_EQUALS'; }
"||="   { return 'CONDITIONAL_EQUALS'; }
"<<="   { return 'SHIFTL_EQUALS'; }
">>="   { return 'SHIFTR_EQUALS'; }
">>>="  { return 'LOGICAL_SHIFTR_EQUALS'; }
"&="    { return 'AND_EQUALS'; }
"|="    { return 'XOR_EQUALS'; }
"^="    { return 'OR_EQUALS'; }
"="     { return 'ASSIGN'; }
"!="    { return 'NOT_EQUAL'; }
"<="    { return 'LESS_THAN_EQUAL'; }
">="    { return 'GREATER_THAN_EQUAL'; }
"<"     { return 'LESS_THAN'; }
">"     { return 'GREATER_THAN'; }
"!"     { return 'LOGICAL_NOT'; }
"&&"    { return 'LOGICAL_AND'; }
"||"    { return 'LOGICAL_OR'; }
"&"     { return 'BITWISE_AND'; }
"|"     { return 'BITWISE_OR'; }
"~"     { return 'BITWISE_NOT'; }
"^"     { return 'XOR'; }
"<<"    { return 'LSHIFT'; }
">>"    { return 'RSHIFT'; }
">>>"   { return 'LOGICAL_RSHIFT'; }

"@"     { return 'MEMBER'; }
"#"     { return 'BIND'; }

"function"{identPart}     { return 'FUNCTION'; }
"var"{identPart}          { return 'VAR'; }
"if"{identPart}           { return 'IF'; }
"instanceof"{identPart}   { return 'INSTANCEOF'; }
"in"{identPart}           { return 'IN'; }
"else"{identPart}         { return 'ELSE'; }
"elseif"{identPart}       { return 'ELSEIF'; }
"for"{identPart}          { return 'FOR'; }
"while"{identPart}        { return 'WHILE'; }
"do"{identPart}           { return 'DO'; }
"this"{identPart}         { return 'THIS'; }
"return"{identPart}       { return 'RETURN'; }
"throw"{identPart}        { return 'THROW'; }
"typeof"{identPart}       { return 'TYPEOF'; }
"try"{identPart}          { return 'TRY'; }
"catch"{identPart}        { return 'CATCH'; }
"finally"{identPart}      { return 'FINALLY'; }
"void"{identPart}         { return 'VOID'; }
"null"{identPart}         { return 'NULL'; }
"new"{identPart}          { return 'NEW'; }
"delete"{identPart}       { return 'DELETE'; }
"switch"{identPart}       { return 'SWITCH'; }
"case"{identPart}         { return 'CASE'; }
"break"{identPart}        { return 'BREAK'; }
"default"{identPart}      { return 'DEFAULT'; }
"false"{identPart}        { return 'FALSE'; }
"true"{identPart}         { return 'TRUE'; }
"super"{identPart}        { return 'SUPER'; }
"undefined"{identPart}    { return 'UNDEFINED'; }
"debugger"{identPart}     { return 'DEBUGGER'; }
"get"{identPart}          { return 'GETTER'; }
"set"{identPart}          { return 'SETTER'; }
"access"{identPart}       { return 'ACCESS'; }
"extends"{identPart}      { return 'EXTENDS'; }
"static"{identPart}       { return 'STATIC'; }
"readonly"{identPart}     { return 'READONLY'; }
"end"{identPart}          { return 'END'; }
"unless"{identPart}       { return 'UNLESS'; }
"until"{identPart}        { return 'UNTIL'; }
"always"{identPart}       { return 'ALWAYS'; }
"class"{identPart}        { return 'CLASS'; }
"closure"{identPart}      { return 'closure'; }
"at"{identPart}           { return 'AT'; }
"like"{identPart}         { return 'LIKE'; }
"unlike"{identPart}       { return 'UNLIKE'; }

[a-zA-Z_\$][_a-zA-Z0-9\$]* {return 'IDENTIFIER'; }

<<EOF>> { return 'EOF'; }

/lex
%start Program

%right MUL_EQUALS,DIV_EQUALS, MOD_EQUALS, PLUS_EQUALS, MINUS_EQUALS, CONDITIONAL_EQUALS, SHIFTL_EQUALS, SHIFTR_EQUALS, LOGICAL_SHIFTR_EQUALS, AND_EQUALS, XOR_EQUALS, OR_EQUALS, ASSIGN
%right LOGICAL_NOT, BITWISE_NOT
%left LOGICAL_AND, LOGICAL_OR, BITWISE_AND, BITWISE_OR
%left LESS_THAN, GREATER_THAN, LESS_THAN_EQUAL, GREATER_THAN_EQUAL, EQUAL, NOT_EQUAL, LIKE
%left PLUS, MINUS
%left ASTERISK, SLASH, MODULUS
%right UMINUS, UPLUS
%left BIND_ARG
%left OPEN_PAREN, OPEN_BRACKET
%right QUESTION
%nonassoc ELSE, INCREMENT, DECREMENT

%%

/**
 * Syntactical Grammar
 */

Program:
    EOF
    { 
      $$ = new Program(); 
      $$.compile();
    }
  | SourceElements EOF
    { $$ = new Program($SourceElements); $$.compile(); }
  | SourceElements
  ;

N__:

  | N__ NEWLINE
  ;

SourceElements: 
    SourceElement
    { $$ = new SourceElements(); $$.add($SourceElement); }
  | SourceElements SourceElement
    { $SourceElements.add($SourceElement); }
  ;

SourceElement: 
    Statement
    { $$ = $Statement; }
  | ClassDeclaration
    { $$ = $ClassDeclaration; }
  | FunctionDeclaration
    { $$ = $FunctionDeclaration; }
  | Closure
    { $$ = $Closure }
  ;

ClassDeclaration:
    CLASS N__ IDENTIFIER ClassBody END
    { $$ = new ClassDeclaration($3, undefined, $ClassBody); }
  | CLASS N__ IDENTIFIER N__ EXTENDS N__ MemberExpression ClassBody END
    { $$ = new ClassDeclaration($3, $MemberExpression, $ClassBody); }
  ;

ClassBody:
    N__
    { $$ = new ClassElements(); }
  | N__ ClassElements N__
    { $$ = $ClassElements; }
  ;

ClassElements:
    ClassElement
    { $$ = new ClassElements(); $$.add($ClassElement); }
  | ClassElements N__ ClassElement
    { $ClassElements.add($ClassElement); }
  ;

ClassElement:
    InstanceVarDeclaration
    { $$ = $InstanceVarDeclaration; }
  | STATIC N__ OPEN_BRACE StatementList CLOSE_BRACE
    { $$ = $StatementList; }
  | Method
    { $$ = $Method; }
  | ClassDeclaration
    { $$ = $ClassDeclaration; }
  ;

Method:
    FunctionDeclaration
    { $$ = new Method(false, $FunctionDeclaration); }
  | STATIC N__ FunctionDeclaration
    { $$ = new Method(true, $FunctionDeclaration); }
  ;

InstanceVarDeclaration:
    VariableStatement EndSt
    { $$ = new InstanceVarDeclaration(false, undefined, $VariableStatement); }
  | STATIC N__ VariableStatement EndSt
    { $$ = new InstanceVarDeclaration(true, undefined, $VariableStatement); }
  | Accessor N__ VariableStatement EndSt
    { $$ = new InstanceVarDeclaration(false, $Accessor, $VariableStatement); }
  | STATIC N__ $Accessor N__ VariableStatement EndSt
    { $$ = new InstanceVarDeclaration(true, $Accessor, $VariableStatement); }
  | Accessor N__ STATIC N__ VariableStatement EndSt
    { $$ = new InstanceVarDeclaration(true, $Accessor, $VariableStatement); }
  ;

Accessor:
    GETTER
    { $$ = $1; }
  | SETTER
    { $$ = $1; }
  | ACCESS
    { $$ = $1; }
  ;

FunctionDeclaration:
  FUNCTION N__ IDENTIFIER N__ Parameters FunctionBody END
  { $$ = new FunctionDeclaration($3, $Parameters, $FunctionBody); }
  ;

Closure:
  CLOSURE N__ Parameters SourceElements END
  { $$ = new Closure($Parameters, $SourceElements); }
  ;

FunctionExpression:
    FUNCTION N__ Parameters FunctionBody END
    { $$ = new FunctionExpression(undefined, $Parameters, $FunctionBody); }
  | FUNCTION N__ IDENTIFIER N__ Parameters FunctionBody END
    { $$ = new FunctionExpression($3, $Parameters, $FunctionBody); }
  ;

ClassExpression:
    CLASS ClassBody END
    { $$ = new ClassExpression(undefined, $ClassBody); }
  | CLASS N__ IDENTIFIER ClassBody END
    { $$ = new ClassExpression($3, $ClassBody); }
  ;

Parameters:
    OPEN_PAREN N__ CLOSE_PAREN
    { $$ = new Parameters(); }
  | OPEN_PAREN N__ ParameterList N__ CLOSE_PAREN
    { $$ = new Parameters($ParameterList); }
  | OPEN_PAREN N__ VarArgs N__ CLOSE_PAREN
    { $$ = new Parameters(new ParameterList(), $VarArgs); }
  | OPEN_PAREN N__ ParameterList N__ COMMA N__ VarArgs N__ CLOSE_PAREN
    { $$ = new Parameters($ParameterList, $VarArgs); }
  ;

ParameterList:
    IDENTIFIER
    { $$ = new ParameterList();  $$.add($1); }
  | DefaultArgument
    { $$ = new ParameterList();  $$.add($DefaultArgument); }
  | ParameterList N__ COMMA N__ IDENTIFIER
    { $ParameterList.add($5); }
  ;

DefaultArgument:
    IDENTIFIER EQUALS
    { $$ = new DefaultArgument($1); }
  | IDENTIFIER EQUALS Expression
    { $$ = new DefaultArgument($1, $Expression); }
  ;

VarArgs:
  IDENTIFIER ELLIPSES
  { $$ = new VarArgs($1); }
  ;

FunctionBody:
    { $$ = new SourceElements(); }
  | SourceElements
    { $$ = $SourceElements; }
  ;

EndSt:
    NEWLINE
    { $$ = new EndSt($1); }
  | SEMI
    { $$ = new EndSt($1); }
  | EOF
    { $$ = new EndSt($1); }
  ;

StatementList: 
    Statement
    { $$ = new StatementList(); $$.add($Statement); }
  | StatementList Statement
    { $StatementList.add($Statement); }
  ;

MemberIdentifier:
  MEMBER IDENTIFIER
  { $$ = new MemberIdentifier($2); }
  ;

ArrayLiteral:
  OPEN_BRACKET ElementList CLOSE_BRACKET
  { $$ = new ArrayLiteral($ElementList); }
  ;

ElementList:
    N__
    { $$ = new ElementList(); }
  | Expression
    { $$ = new ElementList(); $$.add($Expression); }
  | ElementList COMMA Expression
    { $ElementList.add($Expression); }
  ;

ObjectLiteral:
    OPEN_BRACE CLOSE_BRACE
    { $$ = new ObjectLiteral(); }
  | OPEN_BRACE PropertyNameAndValueList CLOSE_BRACE
    { $$ = new ObjectLiteral($PropertyNameAndValueList); }
  ;

PropertyNameAndValueList: 
    PropertyNameAndValue
    { $$ = new PropertyNameAndValueList(); $$.add($PropertyNameAndValue); }
  | PropertyNameAndValueList PropertyNameAndValue
    { $PropertyNameAndValueList.add($PropertyNameAndValue); }
  ;

PropertyNameAndValue:
    NEWLINE
  | PropertyAssignment ElementDelim
  ;

PropertyAssignment:
    PropertyName
    { $$ = new PropertyAssignment($PropertyName); }
  | PropertyName COLON Expression
    { $$ = new PropertyAssignment($PropertyName, $Expression); }
  ;

ElementDelim:
    NEWLINE
  | COMMA
  ;

PropertyName: 
    IDENTIFIER
    { $$ = new PropertyName($1); }
  | STRING_LITERAL
    { $$ = new PropertyName($1); }
  | NUMERIC_LITERAL
    { $$ = new PropertyName($1); }
  ;

ExpressionList:
    Expression
    { $$ = new ExpressionList(); $$.add($Expression) }
  | ExpressionList N__ COMMA N__ Expression
    { $$.add($Expression); }
  ;

Expression:
    AssignmentExpression
    { $$ = new Expression($AssignmentExpression); }
  ;

AssignmentExpression:
    SimpleExpression
    { $$ = new AssignmentExpression($SimpleExpression); }
  | SimpleExpression AssignmentOperator N__ AssignmentExpression
    { $$ = new AssignmentExpression($SimpleExpression, $AssignmentOperator, $AssignmentExpression); }
  | SimpleExpression QUESTION N__ AssignmentExpression N__ COLON N__ AssignmentExpression
    { $$ = new ConditionalExpression($SimpleExpression, $AssignmentExpression1, $AssignmentExpression2); }
  ;

SimpleExpression:
    AdditiveExpression
    { $$ = new SimpleExpression($AdditiveExpression); }
  | SimpleExpression RelativeOperator N__ AdditiveExpression
    { $$ = new SimpleExpression($SimpleExpression, $RelativeOperator, $AdditiveExpression); }
  ;

AdditiveExpression:
    Term
    { $$ = new AdditiveExpression($Term); }
  | AdditiveExpression AddOperator N__ Term
    { $$ = new AdditiveExpression($AdditiveExpression, $AddOperator, $Term); }
  ;

Term:
    UnaryExpression
    { $$ = new Term($UnaryExpression); }
  | Term MultiplicationOp N__ UnaryExpression
    { $$ = new Term($Term, $MultiplicationOp, $UnaryExpression); }
  ;

IncrementExpression:
    UnaryExpression
    { $$ = new IncrementExpression(new Operator(), $UnaryExpression, new Operator()); }
  | UnaryExpression DECREMENT
    { $$ = new IncrementExpression(new Operator(), $UnaryExpression, new Operator($2)); }
  | UnaryExpression INCREMENT
    { $$ = new IncrementExpression(new Operator(), $UnaryExpression, new Operator($2)); }
  | INCREMENT N__ UnaryExpression
    { $$ = new IncrementExpression(new Operator($1), $UnaryExpression, new Operator()); }
  | DECREMENT N__ UnaryExpression
    { $$ = new IncrementExpression(new Operator($1), $UnaryExpression, new Operator()); }
  ;

UnaryExpression:
    LeftHandSideExpression
    { $$ = new UnaryExpression(undefined, $LeftHandSideExpression); }
  | LOGICAL_NOT N__ UnaryExpression
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  | BITWISE_NOT N__ UnaryExpression
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  | QUESTION N__ UnaryExpression
    { $$ = new ConditionalLoadExpression($UnaryExpression); }
  | BIND N__ UnaryExpression
    { $$ = new BindExpression($UnaryExpression); }
  | MINUS N__ UnaryExpression %prec UMINUS
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  | PLUS N__ UnaryExpression %prec UPLUS
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  ;


LeftHandSideExpression:
    NewExpression
    { $$ = $NewExpression; }
  | MemberExpression
    { $$ = $MemberExpression; }
  | FunctionExpression
    { $$ = $FunctionExpression; }
  | ClassExpression
    { $$ = $ClassExpression; }
  ;

ExpressionNoFun:
    AssignmentExpressionNoFun
    { $$ = new Expression($AssignmentExpressionNoFun); }
  | ExpressionNoFun COMMA N__ AssignmentExpression
    { $$ = new Expression($ExpressionNoFun, $AssignmentExpression); }
  ;

AssignmentExpressionNoFun:
    SimpleExpressionNoFun
    { $$ = new AssignmentExpression($SimpleExpressionNoFun); }
  | SimpleExpressionNoFun AssignmentOperator N__ AssignmentExpression
    { $$ = new AssignmentExpression($SimpleExpressionNoFun, $AssignmentOperator, $AssignmentExpression); }
  | SimpleExpressionNoFun QUESTION N__ AssignmentExpression N__ COLON N__ AssignmentExpression
    { $$ = new ConditionalExpression($SimpleExpressionNoFun, $AssignmentExpression1, $AssignmentExpression2); }
  ;

SimpleExpressionNoFun:
    AdditiveExpressionNoFun
    { $$ = new SimpleExpression($AdditiveExpressionNoFun); }
  | SimpleExpressionNoFun RelativeOperator N__ AdditiveExpression
    { $$ = new SimpleExpression($SimpleExpressionNoFun, $RelativeOperator, $AdditiveExpression); }
  ;

AdditiveExpressionNoFun:
    TermNoFun
    { $$ = new AdditiveExpression($TermNoFun); }
  | AdditiveExpressionNoFun AddOperator N__ Term
    { $$ = new AdditiveExpression($AdditiveExpressionNoFun, $AddOperator, $Term); }
  ;

TermNoFun:
    IncrementExpressionNoFun
    { $$ = new Term($IncrementExpressionNoFun); }
  | TermNoFun MultiplicationOp N__ IncrementExpression
    { $$ = new Term($TermNoFun, $MultiplicationOp, $IncrementExpression); }
  ;

IncrementExpressionNoFun:
    UnaryExpressionNoFun
    { $$ = new IncrementExpression(undefined, $UnaryExpressionNoFun); }
  | UnaryExpressionNoFun DECREMENT
    { $$ = new IncrementExpression(new Operator(), $UnaryExpressionNoFun, new Operator($2)); }
  | UnaryExpressionNoFun INCREMENT
    { $$ = new IncrementExpression(new Operator(), $UnaryExpressionNoFun, new Operator($2)); }
  | INCREMENT N__ UnaryExpression
    { $$ = new IncrementExpression(new Operator($1), $UnaryExpression); }
  | DECREMENT N__ UnaryExpression
    { $$ = new IncrementExpression(new Operator($1), $UnaryExpression); }
  ;

UnaryExpressionNoFun:
    LeftHandSideExpressionNoFun
    { $$ = new UnaryExpression(undefined, $LeftHandSideExpressionNoFun); }
  | LOGICAL_NOT N__ UnaryExpression
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  | BITWISE_NOT N__ UnaryExpression
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  | BIND N__ UnaryExpression
    { $$ = new BindExpression($UnaryExpression); }
  | QUESTION N__ UnaryExpression
    { $$ = new ConditionalLoadExpression($UnaryExpression); }
  | DELETE N__ UnaryExpression
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  | TYPEOF N__ UnaryExpression
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  | MINUS N__ UnaryExpression %prec UMINUS
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  | PLUS N__ UnaryExpression %prec UPLUS
    { $$ = new UnaryExpression(new Operator($1), $UnaryExpression); }
  ;

LeftHandSideExpressionNoFun:
    NewExpression
    { $$ = $NewExpression; }
  | MemberExpression
    { $$ = $MemberExpression; }
  ;

NewExpression: 
  NEW N__ LeftHandSideExpression
  { $$ = new NewExpression($LeftHandSideExpression); }
  ;

MemberExpression: 
    PrimaryExpression
    { $$ = $PrimaryExpression; }
  | MemberExpression ArrayDereference
    { $$ = new ArrayMemberAccess($MemberExpression, $ArrayDereference); }
  | MemberExpression DOT N__ IDENTIFIER
    { $$ = new MemberAccess($MemberExpression, $4); }
  | MemberExpression Arguments
    { $$ = new FunctionCall($MemberExpression, $Arguments); }
  ;

ArrayDereference:
  OPEN_BRACKET N__ Expression N__ CLOSE_BRACKET
  { $$ = new ArrayDereference($Expression); }
  ;

Arguments:
    OPEN_PAREN N__ CLOSE_PAREN
    { $$ = new Arguments(); }
  | OPEN_PAREN N__ ArgumentList N__ CLOSE_PAREN
    { $$ = new Arguments($ArgumentList); }
  ;

ArgumentList:
    Expression
    { $$ = new ArgumentList(); $$.add($Expression); }
  | ArgumentList N__ COMMA N__ Expression
    { $$.add($Expression); }
  ;

PrimaryExpression: 
    THIS
    { $$ = new PrimaryExpression($1); }
  | SUPER
    { $$ = new PrimaryExpression($1); }
  | IDENTIFIER
    { $$ = $1; }
  | MemberIdentifier
    { $$ = new MemberIdentifier($MemberIdentifier); }
  | NUMERIC_LITERAL
    { $$ = new PrimaryExpression($1); }
  | STRING_LITERAL
    { $$ = new StringLiteral($1); }
  | SYMBOL
    { $$ = Symbol.get($1); }
  | REGEX
    { $$ = new RegularExpression($1); }
  | ObjectLiteral
    { $$ = new ObjectLiteral($ObjectLiteral); }
  | ArrayLiteral
    { $$ = $ArrayLiteral; }
  | OPEN_PAREN N__ ExpressionList N__ CLOSE_PAREN
    { $$ = new ParenthesizedExpression($ExpressionList); }
  ;

AssignmentOperator:
    MUL_EQUALS
    { $$ = new Operator($1); }
  | DIV_EQUALS
    { $$ = new Operator($1); }
  | MOD_EQUALS
    { $$ = new Operator($1); }
  | PLUS_EQUALS
    { $$ = new Operator($1); }
  | MINUS_EQUALS
    { $$ = new Operator($1); }
  | CONDITIONAL_EQUALS
    { $$ = new Operator($1); }
  | SHIFTL_EQUALS
    { $$ = new Operator($1); }
  | SHIFTR_EQUALS
    { $$ = new Operator($1); }
  | LOGICAL_SHIFTR_EQUALS
    { $$ = new Operator($1); }
  | AND_EQUALS
    { $$ = new Operator($1); }
  | XOR_EQUALS
    { $$ = new Operator($1); }
  | OR_EQUALS
    { $$ = new Operator($1); }
  | ASSIGN
    { $$ = new Operator($1); }
  ;

RelativeOperator:
    EQUAL
    { $$ = new Operator($1); }
  | NOT_EQUAL
    { $$ = new Operator($1); }
  | LIKE
    { $$ = new Operator($1); }
  | UNLIKE
    { $$ = new Operator($1); }
  | LESS_THAN_EQUAL
    { $$ = new Operator($1); }
  | GREATER_THAN_EQUAL
    { $$ = new Operator($1); }
  | LESS_THAN
    { $$ = new Operator($1); }
  | GREATER_THAN
    { $$ = new Operator($1); }
  | LOGICAL_AND
    { $$ = new Operator($1); }
  | LOGICAL_OR
    { $$ = new Operator($1); }
  | BITWISE_AND
    { $$ = new Operator($1); }
  | BITWISE_OR
    { $$ = new Operator($1); }
  | XOR
    { $$ = new Operator($1); }
  | INSTANCEOF
    { $$ = new Operator($1); }
  ;

AddOperator:
    PLUS
    { $$ = new Operator($1); }
  | MINUS
    { $$ = new Operator($1); }
  ;

MultiplicationOp:
    ASTERISK
    { $$ = new Operator($1); }
  | SLASH
    { $$ = new Operator($1); }
  | MODULUS
    { $$ = new Operator($1); }
  ;

Statement:
    TerminatedStatement
    { $$ = $TerminatedStatement; }
  | ComplexStatement  
    { $$ = $ComplexStatement; }
  ;

TerminatedStatement:
    EmptyStatement
    { $$ = undefined; }
  | SimpleStatement EndSt
    { $$ = new TerminatedStatement($SimpleStatement); }
  ;

ComplexStatement: 
    IfStatement
    { $$ = $IfStatement; }
  | UnlessStatement
    { $$ = $UnlessStatement; }
  | IterationStatement
    { $$ = $IterationStatement; }
  | WithStatement
    { $$ = $WithStatement; }
  | SwitchStatement
    { $$ = $SwitchStatement; }
  | TryStatement
    { $$ = $TryStatement; }
  ;

SimpleStatement: 
    VariableStatement
    { $$ = $VariableStatement; }
  | ExpressionStatement
    { $$ = $ExpressionStatement; }
  | BreakStatement
    { $$ = $BreakStatement; }
  | ReturnStatement
    { $$ = $ReturnStatement; }
  | ContinueStatement
    { $$ = $ContinueStatement; }
  | LabelledStatement
    { $$ = $LabelledStatement; }
  | ThrowStatement
    { $$ = $ThrowStatement; }
  | DebuggerStatement
    { $$ = $DebuggerStatement; }
  ;

EmptyStatement:
    SEMI
  | NEWLINE
  ;

ExpressionStatement:
  ExpressionNoFun
  { $$ = new ExpressionStatement($ExpressionNoFun); }
  ;

VariableStatement: 
  VAR N__ VariableDeclarationList
  { $$ = new VariableStatement($VariableDeclarationList); }
  ;

VariableDeclarationList: 
    VariableDeclaration
    { $$ = new VariableDeclarationList(); $$.add($VariableDeclaration); }
  | VariableDeclarationList COMMA N__ VariableDeclaration
    { $VariableDeclarationList.add($VariableDeclaration); }
  ;

VariableDeclaration: 
    IDENTIFIER
    { $$ = new VariableDeclaration($1); }
  | IDENTIFIER ASSIGN N__ Expression
    { $$ = new VariableDeclaration($1, $Expression); }
  ;

IfStatement: 
    IF N__ Expression NEWLINE BlockBody END
    { $$ = new IfStatement($Expression, $BlockBody); }
  | IF N__ Expression NEWLINE BlockBody ElsePart END
    { $$ = new IfStatement($Expression, $BlockBody, undefined, $ElsePart); }
  | IF N__ Expression NEWLINE BlockBody ElseIfPart END
    { $$ = new IfStatement($Expression, $BlockBody, $ElseIfPart); }
  | IF N__ Expression NEWLINE BlockBody ElseIfPart ElsePart END
    { $$ = new IfStatement($Expression, $BlockBody, $ElseIfPart, $ElsePart); }
  | SimpleStatement IF Expression EndSt
    { $$ = new PostfixIfStatement($Expression, $SimpleStatement); }
  ;

UnlessStatement:
    UNLESS N__ Expression NEWLINE BlockBody END
    { $$ = new UnlessStatement($Expression, $BlockBody); }
  | SimpleStatement UNLESS Expression EndSt
    { $$ = new PostfixUnlessStatement($Expression, $SimpleStatement); }
  ;

BlockBody:
    { $$ = new BlockBody(new StatementList()); }
  | StatementList
    { $$ = new BlockBody($StatementList); }
  ;

ElsePart:
  ELSE BlockBody
  { $$ = new ElsePart($BlockBody); }
  ;

ElseIfPart:
    ElseIf
    { $$ = new ElseIfPart(); $$.add($ElseIf); }
  | ElseIfPart ElseIf
    { $ElseIfPart.add($ElseIf); }
  ;

ElseIf:
  ELSEIF N__ Expression NEWLINE BlockBody
  { $$ = new ElseIf($Expression, $BlockBody); }
  ;

IterationStatement:
    WhileLoop
    { $$ = $WhileLoop; }
  | UntilLoop
    { $$ = $UntilLoop; }
  | DoUntilLoop
    { $$ = $DoUntilLoop; }
  | DoWhileLoop
    { $$ = $DoWhileLoop; }
  | ForLoop
    { $$ = $ForLoop; }
  ;

WhileLoop:
  WHILE N__ Expression NEWLINE BlockBody END
  { $$ = new WhileLoop($Expression, $BlockBody); }
  ;

UntilLoop:
  UNTIL N__ Expression NEWLINE BlockBody END
  { $$ = new UntilLoop($Expression, $BlockBody); }
  ;

DoUntilLoop:
  DO BlockBody END N__ UNTIL N__ Expression EndSt
  { $$ = new DoUntilLoop($Expression, $BlockBody); }
  ;

DoWhileLoop:
  DO BlockBody END N__ WHILE N__ Expression EndSt
  { $$ = new DoWhileLoop($Expression, $BlockBody); }
  ;

ForLoop:
  FOR N__ ForLoopCondition NEWLINE BlockBody END
  { $$ = new ForLoop($ForLoopCondition, $BlockBody); }
  ;

ForLoopCondition:
    RegularForLoop
    { $$ = $RegularForLoop; }
  | AdvancedForLoop
    { $$ = $AdvancedForLoop; }
  ;

RegularForLoop:
    SEMI SEMI
    { $$ = new RegularForLoop(); }
  | Expression SEMI SEMI
    { $$ = new RegularForLoop($Expression); }
  | SEMI Expression SEMI
    { $$ = new RegularForLoop(undefined, $Expression); }
  | SEMI SEMI Expression
    { $$ = new RegularForLoop(undefined, undefined, $Expression); }
  | Expression SEMI Expression SEMI
    { $$ = new RegularForLoop($Expression1, $Expression2); }
  | SEMI Expression SEMI Expression
    { $$ = new RegularForLoop(undefined, $Expression1, $Expression2); }
  | Expression SEMI SEMI Expression
    { $$ = new RegularForLoop($Expression1, undefined, $Expression2); }
  | Expression SEMI Expression SEMI Expression
    { $$ = new RegularForLoop($Expression1, $Expression2, $Expression3); }
  ;

AdvancedForLoop:
    Expression IN Expression
    { $$ = new ForEach($Expression1, $Expression2); }
  | Expression IN Expression AT IDENTIFIER
    { $$ = new ForEach($Expression1, $Expression2, $5); }
  | Expression COMMA IDENTIFIER IN Expression
    { $$ = new ForKeyValue($Expression1, $3, $Expression2); }
  | Expression COMMA IDENTIFIER IN Expression AT IDENTIFIER
    { $$ = new ForKeyValue($Expression1, $3, $Expression2, $7); }
  | Expression AT IDENTIFIER
    { $$ = new AdvancedForLoop($Expression); }
  ;

ContinueStatement:
    CONTINUE
    { $$ = new ContinueStatement(); }
  | CONTINUE IDENTIFIER
    { $$ = new ContinueStatement($2); }
  ;

BreakStatement:
    BREAK
    { $$ = new BreakStatement(); }
  | BREAK IDENTIFIER
    { $$ = new BreakStatement($2); }
  ;

ReturnStatement:
    RETURN
    { $$ = new ReturnStatement(); }
  | RETURN Expression
    { $$ = new ReturnStatement($Expression); }
  ;

WithStatement:
  WITH N__ Expression NEWLINE StatementList END
  { $$ = new WithStatement($Expression, $StatementList); }
  ;

SwitchStatement:
    SWITCH N__ Expression NEWLINE CaseBlock END
    { $$ = new SwitchStatement($Expression, $CaseBlock); }
  | SWITCH N__ Expression NEWLINE END
    { $$ = new SwitchStatement($Expression); }
  ;

CaseBlock:
    CaseClauses
    { $$ = new CaseBlock([$CaseClauses]); }
  | DefaultClause
    { $$ = new CaseBlock(undefined, $DefaultClause); }
  | AlwaysClause
    { $$ = new CaseBlock(undefined, undefined, $AlwaysClause); }

  | CaseClauses DefaultClause
    { $$ = new CaseBlock([$CaseClauses], $DefaultClause); }
  | CaseClauses AlwaysClause
    { $$ = new CaseBlock([$CaseClauses], undefined, $AlwaysClause); }
  | DefaultClause AlwaysClause
    { $$ = new CaseBlock(undefined, $DefaultClause, $AlwaysClause); }
  | DefaultClause CaseClauses
    { $$ = new CaseBlock([$CaseClauses], $DefaultClause); }
  | AlwaysClause CaseClauses
    { $$ = new CaseBlock([$CaseClauses], undefined, $AlwaysClause); }
  | AlwaysClause DefaultClause
    { $$ = new CaseBlock(undefined, $DefaultClause, $AlwaysClause); }

  | CaseClauses DefaultClause CaseClauses
    { $$ = new CaseBlock([$CaseClauses1, $CauseClauses2], $DefaultClause); }
  | CaseClauses DefaultClause AlwaysClause
    { $$ = new CaseBlock([$CaseClauses], $DefaultClause, $AlwaysClause); }
  | CaseClauses AlwaysClause CaseClases
    { $$ = new CaseBlock([$CaseClauses1, $CaseClauses2], undefined, $AlwaysClause); }
  | CaseClauses AlwaysClause DefaultClause
    { $$ = new CaseBlock([$CaseClauses], $DefaultClause, $AlwaysClause); }
  | DefaultClause CaseClauses AlwaysClause
    { $$ = new CaseBlock([$CaseClauses], $DefaultClause, $AlwaysClause); }
  | DefaultClause AlwaysClause CaseClauses
    { $$ = new CaseBlock([$CaseClauses], $DefaultClause, $AlwaysClause); }
  | AlwaysClause CaseClauses DefaultClause
    { $$ = new CaseBlock([$CaseClauses], $DefaultClause, $AlwaysClause); }
  | AlwaysClause DefaultClause CaseClauses
    { $$ = new CaseBlock([$CaseClauses], $DefaultClause, $AlwaysClause); }

  | CaseClauses DefaultClause CaseClauses AlwaysClause
    { $$ = new CaseBlock([$CaseClauses1, $CaseClauses2], $DefaultClause, $AlwaysClause); }
  | CaseClauses AlwaysClause CaseClauses DefaultClause
    { $$ = new CaseBlock([$CaseClauses1, $CaseClauses2], $DefaultClause, $AlwaysClause); }
  | CaseClauses DefaultClause AlwaysClause CaseClauses
    { $$ = new CaseBlock([$CaseClauses1, $CaseClauses2], $DefaultClause, $AlwaysClause); }
  | CaseClauses AlwaysClause DefaultClause CaseClauses
    { $$ = new CaseBlock([$CaseClauses1, $CaseClauses2], $DefaultClause, $AlwaysClause); }

  | DefaultClause CaseClauses AlwaysClause CaseClauses
    { $$ = new CaseBlock([$CaseClauses1, $CaseClauses2], $DefaultClause, $AlwaysClause); }
  | AlwaysClause CaseClauses DefaultClause CaseClauses
    { $$ = new CaseBlock([$CaseClauses1, $CaseClauses2], $DefaultClause, $AlwaysClause); }
  ;

CaseClauses:
    CaseClause
    { $$ = new CaseClauses(); $$.add($CaseClause); }
  | CaseClauses CaseClause
    { $CaseClauses.add($CaseClause); }
  ;

CaseClause:
    CASE N__ CaseExpressionList N__ COLON
    { $$ = new CaseClause($CaseExpressionList); }
  | CASE N__ CaseExpressionList N__ COLON StatementList
    { $$ = new CaseClase($CaseExpressionList, $StatementList); }
  ;

CaseExpressionList:
    Expression
    { $$ = new CaseExpressionList(); $$.add($Expression); }
  | CaseExpressionList N__ COMMA N__ Expression
    { $CaseExpressionList.add($Expression); }
  ;

DefaultClause:
    DEFAULT N__ COLON
    { $$ = new DefaultClause(); }
  | DEFAULT N__ COLON StatementList
    { $$ = new DefaultClause($StatementList); }
  ;

AlwaysClause:
    ALWAYS N__ COLON
    { $$ = new AlwaysClause(); }
  | ALWAYS N__ COLON StatementList
    { $$ = new AlwaysClause($StatementList); }
  ;

LabelledStatement:
  IDENTIFIER COLON Statement
  { $$ = new LabelledStatement($1, $Statement); }
  ;

ThrowStatement:
  THROW N__ Expression
  { $$ = new ThrowStatement($Expression); }
  ;

TryStatement:
    TRY Catch END
    { $$ = new TryStatement(undefined, $Catch); }
  | TRY Finally END
    { $$ = new TryStatement(undefined, undefined, $Finally); }
  | TRY Catch Finally END
    { $$ = new TryStatement(undefined, $Catch, $Finally); }
  | TRY StatementList Catch END
    { $$ = new TryStatement($StatementList, $Catch); }
  | TRY StatementList Finally END
    { $$ = new TryStatement($StatementList, undefined, $Finally); }
  | TRY StatementList Catch Finally END
    { $$ = new TryStatement($StatementList, $Catch, $Finally); }
  ;

Catch:
    CATCH
    { $$ = new Catch(); }
  | CATCH NEWLINE StatementList
    { $$ = new Catch(undefined, $StatementList); }
  | CATCH IDENTIFIER NEWLINE StatementList
    { $$ = new Catch($Expression, $StatementList); }
  ;

Finally:
    FINALLY
    { $$ = new Finally(); }
  | FINALLY StatementList
    { $$ = new Finally($StatementList); }
  ;

DebuggerStatement:
  DEBUGGER
  { $$ = new DebuggerStatement(); }
  ;
