import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './infrastructure/app-routing.module';
import { MaterialModule } from './infrastructure/material.module';
import { LayoutModule } from './modules/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationModule } from './infrastructure/auth/auth.module';
import { JwtInterceptor } from './infrastructure/auth/jwt/jwt.interceptor';
import { LearningModule } from './modules/learning/learning.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { ManagementModule } from './modules/management/management.module';
import { KnowledgeAnalyticsModule } from './modules/knowledge-analytics/knowledge-analytics.module';
import { GenericsModule } from './shared/generics/generics.module';
import { AuthoringModule } from './modules/authoring/authoring.module';

export function markdownConfiguration(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.image = (href: string, title: string, text: string) => {
    return '<img width="100%" src="' + href + '" alt="' + text + '">';
  };

  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    AuthenticationModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markdownConfiguration,
      },
    }),
    ReactiveFormsModule,
    LayoutModule,
    LearningModule,
    FormsModule,
    GenericsModule,
    MonitoringModule,
    KnowledgeAnalyticsModule,
    ManagementModule,
    AuthoringModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
