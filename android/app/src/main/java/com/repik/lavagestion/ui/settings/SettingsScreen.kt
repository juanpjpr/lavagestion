package com.repik.lavagestion.ui.settings

import androidx.appcompat.app.AppCompatDelegate
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.os.LocaleListCompat
import com.repik.lavagestion.R

data class LanguageOption(
    val tag: String,
    val labelRes: Int,
    val nameRes: Int
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(onLogout: () -> Unit) {
    val languages = listOf(
        LanguageOption("es", R.string.lang_es, R.string.settings_lang_spanish),
        LanguageOption("en", R.string.lang_en, R.string.settings_lang_english),
        LanguageOption("ko", R.string.lang_ko, R.string.settings_lang_korean),
        LanguageOption("zh", R.string.lang_zh, R.string.settings_lang_chinese)
    )

    val currentLocale = AppCompatDelegate.getApplicationLocales().toLanguageTags().ifEmpty { "es" }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        TopAppBar(
            title = {
                Text(
                    text = stringResource(R.string.settings_title),
                    fontWeight = FontWeight.Bold
                )
            }
        )

        // Language section
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text(
                text = stringResource(R.string.settings_language),
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(4.dp)) {
                    languages.forEach { lang ->
                        val isActive = currentLocale.startsWith(lang.tag)
                        Surface(
                            onClick = {
                                AppCompatDelegate.setApplicationLocales(
                                    LocaleListCompat.forLanguageTags(lang.tag)
                                )
                            },
                            color = if (isActive) MaterialTheme.colorScheme.primaryContainer else Color.Transparent,
                            shape = MaterialTheme.shapes.medium,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    OutlinedButton(
                                        onClick = {},
                                        enabled = false,
                                        modifier = Modifier.size(40.dp),
                                        contentPadding = PaddingValues(0.dp),
                                        colors = ButtonDefaults.outlinedButtonColors(
                                            disabledContainerColor = if (isActive) MaterialTheme.colorScheme.primary else Color.Transparent,
                                            disabledContentColor = if (isActive) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                                        ),
                                        border = BorderStroke(
                                            1.dp,
                                            if (isActive) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
                                        )
                                    ) {
                                        Text(
                                            text = stringResource(lang.labelRes),
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                    }
                                    Text(
                                        text = stringResource(lang.nameRes),
                                        fontSize = 16.sp,
                                        color = if (isActive) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurface
                                    )
                                }
                                if (isActive) {
                                    Text(
                                        text = "✓",
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Logout section
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text(
                text = stringResource(R.string.settings_account),
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            OutlinedButton(
                onClick = onLogout,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = MaterialTheme.colorScheme.error
                ),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.error)
            ) {
                Icon(
                    Icons.AutoMirrored.Filled.ExitToApp,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = stringResource(R.string.settings_logout),
                    fontSize = 16.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}
