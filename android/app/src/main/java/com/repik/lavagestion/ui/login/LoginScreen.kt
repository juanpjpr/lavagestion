package com.repik.lavagestion.ui.login

import androidx.appcompat.app.AppCompatDelegate
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.os.LocaleListCompat
import com.repik.lavagestion.R

@Composable
fun LoginScreen(viewModel: LoginViewModel) {
    val state by viewModel.state.collectAsState()

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var tenantSlug by remember { mutableStateOf("") }
    var tenantName by remember { mutableStateOf("") }
    var userName by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Language selector
        LanguageSelector()

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = stringResource(R.string.login_title),
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = if (state.isRegisterMode) stringResource(R.string.login_create_account) else stringResource(R.string.login_sign_in),
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        state.error?.let { error ->
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
            ) {
                Text(
                    text = error,
                    color = MaterialTheme.colorScheme.onErrorContainer,
                    modifier = Modifier.padding(12.dp),
                    fontSize = 14.sp
                )
            }
        }

        if (state.isRegisterMode) {
            OutlinedTextField(
                value = tenantName,
                onValueChange = { tenantName = it },
                label = { Text(stringResource(R.string.login_tenant_name)) },
                placeholder = { Text(stringResource(R.string.login_tenant_name_hint)) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = userName,
                onValueChange = { userName = it },
                label = { Text(stringResource(R.string.login_user_name)) },
                placeholder = { Text(stringResource(R.string.login_user_name_hint)) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            Spacer(modifier = Modifier.height(12.dp))
        }

        if (!state.isRegisterMode) {
            OutlinedTextField(
                value = tenantSlug,
                onValueChange = { tenantSlug = it },
                label = { Text(stringResource(R.string.login_tenant_slug)) },
                placeholder = { Text(stringResource(R.string.login_tenant_slug_hint)) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            Spacer(modifier = Modifier.height(12.dp))
        }

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text(stringResource(R.string.login_email)) },
            placeholder = { Text(stringResource(R.string.login_email_hint)) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
        )
        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text(stringResource(R.string.login_password)) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation()
        )
        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                if (state.isRegisterMode) {
                    viewModel.register(tenantName, userName, email, password)
                } else {
                    viewModel.login(email, password, tenantSlug)
                }
            },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            enabled = !state.isLoading
        ) {
            if (state.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = MaterialTheme.colorScheme.onPrimary,
                    strokeWidth = 2.dp
                )
            } else {
                Text(
                    text = if (state.isRegisterMode) stringResource(R.string.login_register_btn) else stringResource(R.string.login_enter_btn),
                    fontSize = 16.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = { viewModel.toggleMode() }) {
            Text(
                text = if (state.isRegisterMode) stringResource(R.string.login_has_account)
                       else stringResource(R.string.login_no_account),
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
private fun LanguageSelector() {
    val languages = listOf(
        "es" to R.string.lang_es,
        "en" to R.string.lang_en,
        "ko" to R.string.lang_ko,
        "zh" to R.string.lang_zh
    )

    val currentLocale = AppCompatDelegate.getApplicationLocales().toLanguageTags().ifEmpty { "es" }

    Row(
        horizontalArrangement = Arrangement.Center,
        modifier = Modifier.fillMaxWidth()
    ) {
        languages.forEach { (tag, labelRes) ->
            val isActive = currentLocale.startsWith(tag)
            OutlinedButton(
                onClick = {
                    AppCompatDelegate.setApplicationLocales(
                        LocaleListCompat.forLanguageTags(tag)
                    )
                },
                modifier = Modifier
                    .padding(horizontal = 4.dp)
                    .height(36.dp),
                contentPadding = PaddingValues(horizontal = 12.dp),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = if (isActive) MaterialTheme.colorScheme.primary else Color.Transparent,
                    contentColor = if (isActive) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                ),
                border = BorderStroke(
                    1.dp,
                    if (isActive) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
                )
            ) {
                Text(
                    text = stringResource(labelRes),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
