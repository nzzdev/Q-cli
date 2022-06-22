#Add external dependencies under 'dependencies'
cat >dist/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

#Add external dependencies under 'dependencies'
cat >dist/mjs/package.json <<!EOF
{
    "type": "module"
}
!EOF